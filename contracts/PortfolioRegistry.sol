// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PortfolioRegistry
 * @notice Tamper-proof registry of SHA-256 proofs for a professional portfolio.
 *         Only the owner wallet may register records; anyone may verify them.
 *         Files themselves are never stored on-chain — only their hash + metadata.
 */
contract PortfolioRegistry is Ownable {
    enum RecordType {
        Certificate,
        Resume,
        Achievement,
        Project,
        Internship,
        Ownership
    }


    struct Record {
        bytes32 contentHash;
        RecordType recordType;
        uint32 version;
        uint64 timestamp;
        uint256 blockNumber;
        string metadata;
        bool exists;
    }

    /// @notice Human readable portfolio identity (e.g. "VAMSI-PORTFOLIO-2026").
    string public portfolioId;

    mapping(bytes32 => Record) private _records;
    mapping(bytes32 => bytes32) private _hashOwner; // contentHash => verificationId
    bytes32[] private _recordIds;

    event RecordRegistered(
        bytes32 indexed verificationId,
        RecordType indexed recordType,
        bytes32 contentHash,
        uint32 version,
        uint64 timestamp,
        string metadata
    );

    event RecordUpdated(bytes32 indexed verificationId, string metadata, uint64 timestamp);
    event CertificateRegistered(bytes32 indexed verificationId, bytes32 contentHash);
    event ResumeRegistered(bytes32 indexed verificationId, bytes32 contentHash, uint32 version);
    event AchievementRegistered(bytes32 indexed verificationId, bytes32 contentHash);
    event InternshipRegistered(bytes32 indexed verificationId, bytes32 contentHash);
    event ProjectVersionCreated(bytes32 indexed verificationId, bytes32 contentHash, uint32 version);
    event OwnershipRecorded(bytes32 indexed verificationId, bytes32 contentHash);
    event VerificationPerformed(bytes32 indexed verificationId, bool valid, uint64 timestamp);

    error EmptyHash();
    error VerificationIdExists(bytes32 verificationId);
    error HashAlreadyRegistered(bytes32 contentHash, bytes32 verificationId);
    error UnknownRecord(bytes32 verificationId);
    error LengthMismatch();


    constructor(string memory portfolioId_) Ownable(msg.sender) {
        portfolioId = portfolioId_;
    }

    // --------------------------------------------------------------------
    // Owner-only registration
    // --------------------------------------------------------------------

    function registerCertificate(
        bytes32 verificationId,
        bytes32 contentHash,
        string calldata metadata
    ) external onlyOwner {
        _register(verificationId, RecordType.Certificate, contentHash, 1, metadata);
    }

    function registerResume(
        bytes32 verificationId,
        bytes32 contentHash,
        uint32 version,
        string calldata metadata
    ) external onlyOwner {
        _register(verificationId, RecordType.Resume, contentHash, version, metadata);
    }

    function registerAchievement(
        bytes32 verificationId,
        bytes32 contentHash,
        string calldata metadata
    ) external onlyOwner {
        _register(verificationId, RecordType.Achievement, contentHash, 1, metadata);
    }

    function registerProjectVersion(
        bytes32 verificationId,
        bytes32 contentHash,
        uint32 version,
        string calldata metadata
    ) external onlyOwner {
        _register(verificationId, RecordType.Project, contentHash, version, metadata);
    }

    function registerInternship(
        bytes32 verificationId,
        bytes32 contentHash,
        string calldata metadata
    ) external onlyOwner {
        _register(verificationId, RecordType.Internship, contentHash, 1, metadata);
    }

    function registerOwnership(
        bytes32 verificationId,
        bytes32 contentHash,
        string calldata metadata
    ) external onlyOwner {
        _register(verificationId, RecordType.Ownership, contentHash, 1, metadata);
    }

    /// @notice Register many proofs in a single transaction (gas-efficient bulk anchoring).
    function batchRegister(
        bytes32[] calldata verificationIds,
        RecordType[] calldata recordTypes,
        bytes32[] calldata contentHashes,
        uint32[] calldata versions,
        string[] calldata metadatas
    ) external onlyOwner {
        uint256 len = verificationIds.length;
        if (
            recordTypes.length != len ||
            contentHashes.length != len ||
            versions.length != len ||
            metadatas.length != len
        ) revert LengthMismatch();
        for (uint256 i = 0; i < len; i++) {
            _register(verificationIds[i], recordTypes[i], contentHashes[i], versions[i], metadatas[i]);
        }
    }

    /// @notice Append-only metadata correction. The content hash can never change.
    function updateMetadata(bytes32 verificationId, string calldata metadata) external onlyOwner {
        Record storage r = _records[verificationId];
        if (!r.exists) revert UnknownRecord(verificationId);
        r.metadata = metadata;
        emit RecordUpdated(verificationId, metadata, uint64(block.timestamp));
    }

    function _register(
        bytes32 verificationId,
        RecordType recordType,
        bytes32 contentHash,
        uint32 version,
        string memory metadata
    ) internal {
        if (contentHash == bytes32(0) || verificationId == bytes32(0)) revert EmptyHash();
        if (_records[verificationId].exists) revert VerificationIdExists(verificationId);

        bytes32 existing = _hashOwner[contentHash];
        if (existing != bytes32(0)) revert HashAlreadyRegistered(contentHash, existing);

        uint64 ts = uint64(block.timestamp);
        _records[verificationId] = Record({
            contentHash: contentHash,
            recordType: recordType,
            version: version,
            timestamp: ts,
            blockNumber: block.number,
            metadata: metadata,
            exists: true
        });
        _hashOwner[contentHash] = verificationId;
        _recordIds.push(verificationId);

        emit RecordRegistered(verificationId, recordType, contentHash, version, ts, metadata);

        if (recordType == RecordType.Certificate) emit CertificateRegistered(verificationId, contentHash);
        else if (recordType == RecordType.Resume) emit ResumeRegistered(verificationId, contentHash, version);
        else if (recordType == RecordType.Achievement) emit AchievementRegistered(verificationId, contentHash);
        else if (recordType == RecordType.Project) emit ProjectVersionCreated(verificationId, contentHash, version);
        else if (recordType == RecordType.Internship) emit InternshipRegistered(verificationId, contentHash);
        else emit OwnershipRecorded(verificationId, contentHash);
    }


    // --------------------------------------------------------------------
    // Public verification (read-only, free)
    // --------------------------------------------------------------------

    /// @notice True when the supplied hash matches the stored proof exactly.
    function verifyHash(bytes32 verificationId, bytes32 contentHash) external view returns (bool) {
        Record storage r = _records[verificationId];
        return r.exists && r.contentHash == contentHash;
    }

    /// @notice Free batch verification — one RPC call for many proofs.
    function verifyBatch(bytes32[] calldata verificationIds, bytes32[] calldata contentHashes)
        external
        view
        returns (bool[] memory results)
    {
        if (verificationIds.length != contentHashes.length) revert LengthMismatch();
        results = new bool[](verificationIds.length);
        for (uint256 i = 0; i < verificationIds.length; i++) {
            Record storage r = _records[verificationIds[i]];
            results[i] = r.exists && r.contentHash == contentHashes[i];
        }
    }

    /// @notice Verification that leaves an on-chain audit event (optional, costs gas).
    function verifyAndLog(bytes32 verificationId, bytes32 contentHash) external returns (bool valid) {
        Record storage r = _records[verificationId];
        valid = r.exists && r.contentHash == contentHash;
        emit VerificationPerformed(verificationId, valid, uint64(block.timestamp));
    }


    function getMetadata(bytes32 verificationId) external view returns (string memory) {
        if (!_records[verificationId].exists) revert UnknownRecord(verificationId);
        return _records[verificationId].metadata;
    }

    function getRecord(bytes32 verificationId)
        external
        view
        returns (
            bytes32 contentHash,
            RecordType recordType,
            uint32 version,
            uint64 timestamp,
            uint256 blockNumber,
            string memory metadata
        )
    {
        Record storage r = _records[verificationId];
        if (!r.exists) revert UnknownRecord(verificationId);
        return (r.contentHash, r.recordType, r.version, r.timestamp, r.blockNumber, r.metadata);
    }

    /// @notice 0 = unknown, 1 = registered.
    function getVerificationStatus(bytes32 verificationId) external view returns (uint8) {
        return _records[verificationId].exists ? 1 : 0;
    }

    function verificationIdForHash(bytes32 contentHash) external view returns (bytes32) {
        return _hashOwner[contentHash];
    }

    function totalRecords() external view returns (uint256) {
        return _recordIds.length;
    }

    function recordIdAt(uint256 index) external view returns (bytes32) {
        return _recordIds[index];
    }
}
