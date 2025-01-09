// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Payment will be in APE coin and the platform will operate on ApeChain.
// The Platform FEE will be 0.5%, and 0.5% of the amount of each Gas fee will be charged to the platform's wallet as a commission.
// Only the employer can change the status of the job offer, and when the job offer status is changed to successful, the payment for the job that was transferred to the admin account will be transferred to the employee. In doing so, a 0.5% commission will be charged.

interface IERC20 {
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

contract ApeLance {
    address public owner;
    uint256 public platformFee; // Platform fee percentage (0.5%)
    IERC20 public apeToken; // APE token contract address

    enum JobStatus {
        Assigned,
        Completed,
        Cancelled,
        Paid
    }

    enum WorkStatus {
        Doing,
        Completed,
        Cancelled,
        Paid
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'Not authorized');
        _;
    }

    struct AcceptedOfferJob {
        uint id;
        string web2JobId;
        string hashedJob;
        address jobCreater;
        address freelancer;
        uint256 offerAmount;
        JobStatus status;
        WorkStatus workStatus;
    }

    uint256 public offerId;

    mapping(uint256 => AcceptedOfferJob) public acceptedOffer;

    event OfferAccepted(
        uint256 indexed offerId,
        string web2JobId,
        address indexed jobCreater,
        uint256 offerAmount
    );
    event JobStatusUpdated(
        uint256 indexed offerId,
        JobStatus status,
        WorkStatus workStatus
    );
    event PaymentTransferred(
        uint256 indexed offerId,
        address indexed freelancer,
        uint256 amount
    );
    event AdminTransfer(address indexed recipient, uint256 amount);

    constructor(uint256 _platformFee, address _apeToken) {
        owner = msg.sender; // Admin's wallet
        platformFee = _platformFee; // Platform fee percentage
        apeToken = IERC20(_apeToken); // Set APE token contract address
    }

    // With this action, the employer is requested to withdraw the amount of the work to the admin account.
    // Accepts an offer and locks the APE amount in the contract
    function acceptOffer(
        string memory web2JobId,
        string memory hashedJob,
        uint256 amount
    ) external {
        require(amount > 0, 'Payment required to post a job');
        require(
            apeToken.transferFrom(msg.sender, address(this), amount),
            'Payment transfer failed'
        );

        offerId++;
        acceptedOffer[offerId] = AcceptedOfferJob({
            id: offerId,
            web2JobId: web2JobId,
            hashedJob: hashedJob,
            jobCreater: msg.sender,
            freelancer: address(0),
            offerAmount: amount,
            status: JobStatus.Assigned,
            workStatus: WorkStatus.Doing
        });

        emit OfferAccepted(offerId, web2JobId, msg.sender, amount);
    }

    // Updates the job status and transfers payment when job is completed
    function updateJobStatus(
        uint256 _offerId,
        JobStatus newStatus,
        address freelancer
    ) external {
        AcceptedOfferJob storage job = acceptedOffer[_offerId];
        require(
            msg.sender == job.jobCreater,
            'Only the job creator can update status'
        );
        require(
            job.status == JobStatus.Assigned,
            'Job not in a modifiable state'
        );
        require(newStatus == JobStatus.Completed, 'Invalid status update');

        job.status = newStatus;
        job.workStatus = WorkStatus.Completed;
        job.freelancer = freelancer;

        // Calculate platform fee and transfer remaining amount to freelancer
        uint256 commission = (job.offerAmount * platformFee) / 10000; // 0.5% = 50/10000
        uint256 paymentToFreelancer = job.offerAmount - commission;

        require(
            apeToken.transfer(owner, commission),
            'Platform commission transfer failed'
        );
        require(
            apeToken.transfer(freelancer, paymentToFreelancer),
            'Payment to freelancer failed'
        );

        emit JobStatusUpdated(_offerId, newStatus, WorkStatus.Completed);
        emit PaymentTransferred(_offerId, freelancer, paymentToFreelancer);
    }

    // Allows the admin to manually transfer funds
    function adminTransfer(
        address recipient,
        uint256 amount
    ) external onlyOwner {
        require(amount > 0, 'Amount must be greater than zero');
        require(apeToken.transfer(recipient, amount), 'Transfer failed');

        emit AdminTransfer(recipient, amount);
    }

    function updateFeePercent(uint256 _feePercent) external onlyOwner {
        platformFee = _feePercent;
    }
}
