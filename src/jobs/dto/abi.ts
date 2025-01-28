export const ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_platformFee',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'AdminTransfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'offerId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum ApeLance.JobStatus',
        name: 'status',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'enum ApeLance.WorkStatus',
        name: 'workStatus',
        type: 'uint8',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'actor',
        type: 'address',
      },
    ],
    name: 'JobStatusUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'offerId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'web2JobId',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'jobCreator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'freelancer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'offerAmount',
        type: 'uint256',
      },
    ],
    name: 'OfferAccepted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'offerId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'freelancer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum ApeLance.WorkStatus',
        name: 'workStatus',
        type: 'uint8',
      },
    ],
    name: 'PaymentTransferred',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'web2JobId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'hashedJob',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'freelancer',
        type: 'address',
      },
    ],
    name: 'acceptOffer',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'acceptedOffer',
    outputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'web2JobId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'hashedJob',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'jobCreator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'freelancer',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'offerAmount',
        type: 'uint256',
      },
      {
        internalType: 'enum ApeLance.JobStatus',
        name: 'status',
        type: 'uint8',
      },
      {
        internalType: 'enum ApeLance.WorkStatus',
        name: 'workStatus',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'adminTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFreelancerJobList',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'web2JobId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'hashedJob',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'jobCreator',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'freelancer',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'offerAmount',
            type: 'uint256',
          },
          {
            internalType: 'enum ApeLance.JobStatus',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'enum ApeLance.WorkStatus',
            name: 'workStatus',
            type: 'uint8',
          },
        ],
        internalType: 'struct ApeLance.AcceptedOfferJob[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_offerId',
        type: 'uint256',
      },
    ],
    name: 'getJobById',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'web2JobId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'hashedJob',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'jobCreator',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'freelancer',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'offerAmount',
            type: 'uint256',
          },
          {
            internalType: 'enum ApeLance.JobStatus',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'enum ApeLance.WorkStatus',
            name: 'workStatus',
            type: 'uint8',
          },
        ],
        internalType: 'struct ApeLance.AcceptedOfferJob',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUserJobList',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'web2JobId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'hashedJob',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'jobCreator',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'freelancer',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'offerAmount',
            type: 'uint256',
          },
          {
            internalType: 'enum ApeLance.JobStatus',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'enum ApeLance.WorkStatus',
            name: 'workStatus',
            type: 'uint8',
          },
        ],
        internalType: 'struct ApeLance.AcceptedOfferJob[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'offerId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'platformFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_offerId',
        type: 'uint256',
      },
      {
        internalType: 'enum ApeLance.JobStatus',
        name: 'newStatus',
        type: 'uint8',
      },
    ],
    name: 'updateCreatorJobStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_feePercent',
        type: 'uint256',
      },
    ],
    name: 'updateFeePercent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_offerId',
        type: 'uint256',
      },
      {
        internalType: 'enum ApeLance.WorkStatus',
        name: 'newStatus',
        type: 'uint8',
      },
    ],
    name: 'updateFreelancerJobStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_offerId',
        type: 'uint256',
      },
    ],
    name: 'withdrawCreator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_offerId',
        type: 'uint256',
      },
    ],
    name: 'withdrawFreelancer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
