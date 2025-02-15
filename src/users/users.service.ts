import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AcceptOffer } from '../accept-offer/entities/accept-offer.entity';
import { QueryDto } from './dto/query.dto';
import { HttpService } from '@nestjs/axios';
import { Job } from '../jobs/entities/jobs.entity';
import { JobStatus } from '../jobs/enum';
import { lastValueFrom } from 'rxjs';
import { Cron } from '@nestjs/schedule';
import {
  NftContractAddress,
  NftContractAddressETH,
  NftContractAddressWithBadge,
} from './enum';
import { ReviewDto } from './dto/create-user.dto';
import { ImageService } from '../image/image.service';
import { ethers } from 'ethers';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private provider: ethers.Provider;
  private contract: ethers.Contract;
  private nftABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  ];

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(AcceptOffer.name)
    private offerModel: Model<AcceptOffer>,
    @InjectModel(Job.name)
    private jobModel: Model<Job>,
    private readonly httpService: HttpService,
    private readonly imageService: ImageService,
  ) {
    this.provider = new ethers.JsonRpcProvider('https://rpc.apechain.com');
    this.contract = new ethers.Contract(
      '0xB3A12aa155DCd85d7aeD8acb6347761a7C7ecf83',
      this.nftABI,
      this.provider,
    );
  }

  private async fetchBalance(userAddress: string, contractAddress: string) {
    try {
      this.contract = new ethers.Contract(
        contractAddress,
        this.nftABI,
        this.provider,
      );
      const balanceResponse = await this.provider.call({
        to: contractAddress,
        data: this.contract.interface.encodeFunctionData('balanceOf', [
          userAddress,
        ]),
      });

      if (balanceResponse === '0x') {
        throw new Error('The contract did not return a valid balance.');
      }

      const balance = ethers.toNumber(balanceResponse);
      return balance;
    } catch (error) {
      console.error('Error fetching balance:', error.message);
      return null;
    }
  }

  private async fetchUserNFTs(userAddress: string, contractAddress: string) {
    if (!contractAddress) return false;
    try {
      const balance = await this.fetchBalance(userAddress, contractAddress);
      if (balance !== null && balance > 0) {
        return contractAddress;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error in fetchUserNFTs:', error.message);
    }
  }

  async login(web3address: string) {
    const user = new this.userModel({ web3address });
    await user.save();
    return user;
  }

  async findAll(query: QueryDto) {
    const {
      sort = '-createdAt',
      page = 1,
      limit = 10,
      category,
      skills,
      minBudget,
      maxBudget,
      search,
      badge,
    } = query;

    // Build search options
    const options: Record<string, any> = {
      userName: { $exists: true },
      $expr: { $gt: [{ $size: '$job_roles' }, 0] },
    };

    // Add category filter if provided
    if (category) {
      options.job_roles = { $in: category };
    }

    if (search) {
      options.$or = [{ userName: new RegExp(search, 'i') }];
    }

    if (skills) {
      options.skills = { $in: skills };
    }

    if (badge) {
      options.badges = { $in: badge };
    }

    if (minBudget !== undefined || maxBudget !== undefined) {
      options['budget.amount'] = {};

      if (minBudget !== undefined)
        options['budget.amount'].$gte = Number(minBudget);

      if (maxBudget !== undefined)
        options['budget.amount'].$lte = Number(maxBudget);
    }

    const skip = (page - 1) * limit;

    const totalUsers = await this.userModel.countDocuments(options);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await this.userModel
      .find(options)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    return { users, totalPage: totalPages };
  }

  async me(sub: string) {
    const user = await this.userModel
      .findById(sub)
      .populate('saved_profile')
      .populate({
        path: 'reviews.job',
      })
      .populate({
        path: 'reviews.reviewer', // Populate the 'reviewer' field in the reviews
        select: 'userName profile web3address badges', // Select specific fields from the User schema
      })
      .exec();

    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async findOne(sub: string) {
    const user = await this.userModel
      .findOne({ _id: sub })
      .populate({
        path: 'reviews.job',
      })
      .populate({
        path: 'reviews.reviewer', // Populate the 'reviewer' field in the reviews
        select: 'userName profile web3address badges', // Select specific fields from the User schema
      })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${sub} not found`);
    }
    return { user };
  }

  async findOneWeb3(address: string) {
    const user = await this.userModel
      .findOne({
        web3address: address,
      })
      .select('+nonce');
    return user;
  }

  async update(sub: string, updateUserDto: UpdateUserDto) {
    const { profile } = updateUserDto;
    try {
      let matches = null;
      if (profile) {
        matches = profile.match(/^data:(.+);base64,(.+)$/);
      }
      if (matches) {
        const id = await this.imageService.uploadBase64(profile);
        updateUserDto.profile = `https://d1mreutxek5buh.cloudfront.net/uploads/${id}`;
      }
      const user = await this.me(sub);
      Object.assign(user, updateUserDto);
      await user.save();
      return user;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async updateRating(sub: string) {
    const user = await this.me(sub);
    const acceptOffers = await this.offerModel.find({
      freelancer: sub,
      'review.rating': { $gt: 0 },
    });

    const totalReviews = acceptOffers.length;
    const totalRating = acceptOffers.reduce(
      (sum, offer) => sum + offer.review.rating,
      0,
    );
    const newRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    user.reviewCount = totalReviews;
    user.rating = newRating;
    await user.save();
    return true;
  }

  async saveJob(sub: string, jobId: string) {
    const user = await this.me(sub);
    const job = await this.jobModel.findById(jobId);
    if (!job) {
      throw new NotFoundException('Job not fount');
    }
    if (job.client.toString() === sub) {
      throw new BadRequestException('This job is your job');
    }
    if (job.status !== JobStatus.Open) {
      throw new BadRequestException('This job not open');
    }
    const savedJob = await this.userModel.findOne({
      _id: sub,
      saved_jobs: { $in: jobId },
    });
    if (savedJob) {
      throw new BadRequestException('you already saved this job');
    }
    user.saved_jobs.push(jobId as any);
    await user.save();
    return user;
  }

  async removeJob(sub: string, jobId: string) {
    const user = await this.me(sub);
    const updateResult = await this.userModel.updateOne(
      { _id: sub },
      { $pull: { saved_jobs: jobId } },
    );

    if (updateResult.modifiedCount === 0) {
      throw new BadRequestException('Job not found in saved jobs');
    }
    return !!user;
  }

  async saveUser(sub: string, userId: string) {
    if (sub === userId) {
      throw new BadRequestException(`It's you!`);
    }
    const user = await this.me(sub);
    await this.me(userId);
    const savedJob = await this.userModel.findOne({
      _id: sub,
      saved_profile: { $in: userId },
    });
    if (savedJob) {
      throw new BadRequestException('you already saved this user');
    }
    user.saved_profile.push(userId as any);
    await user.save();
    return user;
  }

  async removeUser(sub: string, userId: string) {
    const user = await this.me(sub);
    const updateResult = await this.userModel.updateOne(
      { _id: sub },
      { $pull: { saved_profile: userId } },
    );

    if (updateResult.modifiedCount === 0) {
      throw new BadRequestException('User not found in saved users');
    }
    return !!user;
  }

  async syncNftAndBadges(sub: string) {
    const user = await this.me(sub);
    const res = (
      await Promise.allSettled(
        NftContractAddress.map(async (el: string) => {
          return await this.fetchUserNFTs(user.web3address, el);
        }),
      )
    )
      .filter(
        (result): result is PromiseFulfilledResult<string | false> =>
          result.status === 'fulfilled',
      )
      .map((result) => result.value)
      .filter((isHave): isHave is string => !!isHave);
    let badges: string[] = Array.from(
      new Set(
        res
          .map((el) => NftContractAddressWithBadge[el])
          .filter((badge): badge is string => !!badge), // Filter and assert type
      ),
    );

    const fetchedNFTs = await this.getNfts(user.web3address);
    console.log(`${sub} user's nfts: `, fetchedNFTs);
    if (fetchedNFTs?.ownedNfts?.length) {
      const fetchedBadges = fetchedNFTs.ownedNfts
        .map((el) => el?.contract?.address)
        .map((address) => NftContractAddressWithBadge[address])
        .filter((badge): badge is string => !!badge);
      badges = Array.from(new Set([...badges, ...fetchedBadges]));
    }
    if (badges !== user.all_badges) {
      user.all_badges = badges;
      user.lastSynced = new Date();
      await user.save();
    }
    return user;
  }

  async addReview(id: string, sub: string, dto: ReviewDto) {
    try {
      const user = await this.me(id);
      const review = { reviewer: sub, ...dto } as any;
      user.reviews.push(review);
      const totalReviews = user.reviews.length;
      const totalRating = user.reviews.reduce(
        (sum, rev) => sum + rev.rating,
        0,
      );
      const newRating = totalReviews > 0 ? totalRating / totalReviews : 0;
      user.reviewCount = totalReviews;
      user.rating = Number(newRating.toFixed(2));
      await user.save();
      return user;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async getNfts(walletAddress: string) {
    const url = `${process.env.WEB3_URL}/nft/v3/${process.env.WEB3_API_KEY}/getNFTsForOwner`;
    const params = {
      owner: walletAddress,
      contractAddresses: NftContractAddressETH,
      withMetadata: true,
      pageSize: 100,
    };
    const result = await lastValueFrom(this.httpService.get(url, { params }));
    return result.data;
  }

  // @Cron('*/1 * * * *')
  @Cron('0 0 * * *')
  async handleMidnightTask() {
    this.logger.log('Running the midnight sync job');

    const users = await this.userModel.find();
    for (const user of users) {
      await this.syncNftAndBadges(user._id);
      await this.delay(10000);
      // await this.delay(30000);
    }

    this.logger.log('end');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
