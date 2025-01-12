import { BadRequestException } from '@nestjs/common';
import { isAddress } from 'ethers';

export const ValidWeb3Address = (address: string) => {
  const validAddress = isAddress(address);
  if (!validAddress) {
    throw new BadRequestException('This address is not a web3 address.');
  }
  return true;
};
