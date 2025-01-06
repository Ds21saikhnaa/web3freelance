// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelanceJobSystem {
    address public owner;
    uint256 public feePercent; // Platform fee percentage

    struct Job {
        uint256 id;
        address employer;
        string description;
        uint256 payment;
        bool isActive;
        bool isCompleted;
    }

    struct Offer {
        uint256 id;
        address freelancer;
        uint256 jobId;
        uint256 offerAmount;
        bool isAccepted;
    }

    uint256 public nextJobId;
    uint256 public nextOfferId;

    mapping(uint256 => Job) public jobs;
    mapping(uint256 => Offer) public offers;
    mapping(uint256 => uint256[]) public jobOffers; // Job ID to offer IDs
    mapping(address => uint256) public balances; // Freelancer balances

    event JobPosted(uint256 jobId, address employer, uint256 payment);
    event OfferMade(uint256 offerId, uint256 jobId, address freelancer, uint256 offerAmount);
    event OfferAccepted(uint256 offerId, uint256 jobId, address freelancer);
    event JobCompleted(uint256 jobId, address freelancer, uint256 payment);

    constructor(uint256 _feePercent) {
        owner = msg.sender;
        feePercent = _feePercent;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyEmployer(uint256 jobId) {
        require(jobs[jobId].employer == msg.sender, "Not the employer");
        _;
    }

    modifier jobExists(uint256 jobId) {
        require(jobs[jobId].id == jobId, "Job does not exist");
        _;
    }

    modifier offerExists(uint256 offerId) {
        require(offers[offerId].id == offerId, "Offer does not exist");
        _;
    }

    function postJob(string memory description) external payable {
        require(msg.value > 0, "Payment required to post job");

        uint256 jobId = nextJobId++;
        jobs[jobId] = Job(jobId, msg.sender, description, msg.value, true, false);

        emit JobPosted(jobId, msg.sender, msg.value);
    }

    function makeOffer(uint256 jobId, uint256 offerAmount) external jobExists(jobId) {
        require(jobs[jobId].isActive, "Job is not active");

        uint256 offerId = nextOfferId++;
        offers[offerId] = Offer(offerId, msg.sender, jobId, offerAmount, false);
        jobOffers[jobId].push(offerId);

        emit OfferMade(offerId, jobId, msg.sender, offerAmount);
    }

    function acceptOffer(uint256 offerId) external offerExists(offerId) onlyEmployer(offers[offerId].jobId) {
        Offer storage offer = offers[offerId];
        require(!offer.isAccepted, "Offer already accepted");

        offer.isAccepted = true;
        jobs[offer.jobId].isActive = false;

        emit OfferAccepted(offerId, offer.jobId, offer.freelancer);
    }

    function completeJob(uint256 jobId) external jobExists(jobId) onlyEmployer(jobId) {
        Job storage job = jobs[jobId];
        require(!job.isCompleted, "Job already completed");

        uint256 offerId = getAcceptedOffer(jobId);
        require(offerId != type(uint256).max, "No accepted offer found");

        Offer storage offer = offers[offerId];
        uint256 fee = (job.payment * feePercent) / 100;
        uint256 paymentToFreelancer = job.payment - fee;

        balances[offer.freelancer] += paymentToFreelancer;
        job.isCompleted = true;

        emit JobCompleted(jobId, offer.freelancer, paymentToFreelancer);
    }

    function withdrawBalance() external {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "No balance to withdraw");

        balances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
    }

    function getAcceptedOffer(uint256 jobId) public view jobExists(jobId) returns (uint256) {
        uint256[] memory offerIds = jobOffers[jobId];
        for (uint256 i = 0; i < offerIds.length; i++) {
            if (offers[offerIds[i]].isAccepted) {
                return offerIds[i];
            }
        }
        return type(uint256).max; // No accepted offer
    }

    function updateFeePercent(uint256 _feePercent) external onlyOwner {
        feePercent = _feePercent;
    }

    function withdrawPlatformFees() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
