// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    struct Certificate {
        bytes32 hash;
        address issuer;
        uint256 timestamp;
        bool isRevoked;
    }

    mapping(string => Certificate) public certificates;
    mapping(address => bool) public issuers;

    event CertificateIssued(string certificateId, bytes32 hash, address issuer);
    event CertificateRevoked(string certificateId);

    modifier onlyIssuer() {
        require(issuers[msg.sender], "Not authorized as issuer");
        _;
    }

    function addIssuer(address issuer) external {
        issuers[issuer] = true;
    }

    function issueCertificate(string memory certificateId, bytes32 hash) external onlyIssuer {
        require(certificates[certificateId].hash == bytes32(0), "Certificate already exists");
        
        certificates[certificateId] = Certificate({
            hash: hash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            isRevoked: false
        });

        emit CertificateIssued(certificateId, hash, msg.sender);
    }

    function verifyCertificate(string memory certificateId, bytes32 hash) external view returns (bool) {
        Certificate memory cert = certificates[certificateId];
        return cert.hash == hash && !cert.isRevoked;
    }

    function revokeCertificate(string memory certificateId) external onlyIssuer {
        require(certificates[certificateId].issuer == msg.sender, "Not the certificate issuer");
        certificates[certificateId].isRevoked = true;
        emit CertificateRevoked(certificateId);
    }
}