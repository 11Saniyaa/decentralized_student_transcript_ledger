// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TranscriptLedger is Ownable {
    struct TranscriptRecord {
        string ipfsCid;
        string docName;
        string studentPRN;
        address issuer;
        uint256 timestamp;
    }

    // Mapping from student PRN to array of transcript records
    mapping(string => TranscriptRecord[]) public transcriptsByPRN;

    // Event emitted when a transcript is issued
    event TranscriptIssued(
        string indexed prn,
        string ipfsCid,
        address indexed issuer,
        uint256 timestamp,
        bytes32 docHash
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Issue a transcript for a student
     * @param prn Student's PRN (Primary Registration Number)
     * @param ipfsCid IPFS CID of the transcript document
     * @param docName Name of the document
     */
    function issueTranscript(
        string memory prn,
        string memory ipfsCid,
        string memory docName
    ) public {
        bytes32 docHash = keccak256(abi.encodePacked(ipfsCid, docName, prn));
        
        TranscriptRecord memory newRecord = TranscriptRecord({
            ipfsCid: ipfsCid,
            docName: docName,
            studentPRN: prn,
            issuer: msg.sender,
            timestamp: block.timestamp
        });

        transcriptsByPRN[prn].push(newRecord);

        emit TranscriptIssued(
            prn,
            ipfsCid,
            msg.sender,
            block.timestamp,
            docHash
        );
    }

    /**
     * @dev Get all transcripts for a given PRN
     * @param prn Student's PRN
     * @return Array of transcript records
     */
    function getTranscripts(string memory prn) public view returns (TranscriptRecord[] memory) {
        return transcriptsByPRN[prn];
    }

    /**
     * @dev Get the count of transcripts for a given PRN
     * @param prn Student's PRN
     * @return Count of transcripts
     */
    function getTranscriptCount(string memory prn) public view returns (uint256) {
        return transcriptsByPRN[prn].length;
    }

    /**
     * @dev Get a specific transcript by PRN and index
     * @param prn Student's PRN
     * @param index Index of the transcript in the array
     * @return Transcript record
     */
    function getTranscriptByIndex(string memory prn, uint256 index) public view returns (TranscriptRecord memory) {
        require(index < transcriptsByPRN[prn].length, "Index out of bounds");
        return transcriptsByPRN[prn][index];
    }
}
