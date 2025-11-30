const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TranscriptLedger", function () {
  let transcriptLedger;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const TranscriptLedger = await ethers.getContractFactory("TranscriptLedger");
    transcriptLedger = await TranscriptLedger.deploy();
    await transcriptLedger.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await transcriptLedger.owner()).to.equal(owner.address);
    });
  });

  describe("Issue Transcript", function () {
    it("Should issue a transcript and emit event", async function () {
      const prn = "PRN2024001";
      const ipfsCid = "QmTest123";
      const docName = "Transcript_2024.pdf";

      const tx = await transcriptLedger.issueTranscript(prn, ipfsCid, docName);
      await expect(tx)
        .to.emit(transcriptLedger, "TranscriptIssued")
        .withArgs(prn, ipfsCid, owner.address, (value) => value > 0, (value) => ethers.isHexString(value) && value.length === 66);

      const transcripts = await transcriptLedger.getTranscripts(prn);
      expect(transcripts.length).to.equal(1);
      expect(transcripts[0].ipfsCid).to.equal(ipfsCid);
      expect(transcripts[0].docName).to.equal(docName);
      expect(transcripts[0].studentPRN).to.equal(prn);
      expect(transcripts[0].issuer).to.equal(owner.address);
    });

    it("Should allow multiple transcripts for the same PRN", async function () {
      const prn = "PRN2024001";
      
      await transcriptLedger.issueTranscript(prn, "QmTest1", "Transcript1.pdf");
      await transcriptLedger.issueTranscript(prn, "QmTest2", "Transcript2.pdf");
      await transcriptLedger.issueTranscript(prn, "QmTest3", "Transcript3.pdf");

      const count = await transcriptLedger.getTranscriptCount(prn);
      expect(count).to.equal(3);
    });

    it("Should allow anyone to issue transcripts", async function () {
      const prn = "PRN2024002";
      const ipfsCid = "QmTest456";
      const docName = "Transcript_Student2.pdf";

      await expect(transcriptLedger.connect(addr1).issueTranscript(prn, ipfsCid, docName))
        .to.emit(transcriptLedger, "TranscriptIssued");

      const transcripts = await transcriptLedger.getTranscripts(prn);
      expect(transcripts.length).to.equal(1);
      expect(transcripts[0].issuer).to.equal(addr1.address);
    });
  });

  describe("Get Transcripts", function () {
    it("Should return empty array for non-existent PRN", async function () {
      const transcripts = await transcriptLedger.getTranscripts("PRN999");
      expect(transcripts.length).to.equal(0);
    });

    it("Should return correct transcript by index", async function () {
      const prn = "PRN2024003";
      
      await transcriptLedger.issueTranscript(prn, "QmFirst", "First.pdf");
      await transcriptLedger.issueTranscript(prn, "QmSecond", "Second.pdf");

      const firstTranscript = await transcriptLedger.getTranscriptByIndex(prn, 0);
      const secondTranscript = await transcriptLedger.getTranscriptByIndex(prn, 1);

      expect(firstTranscript.ipfsCid).to.equal("QmFirst");
      expect(secondTranscript.ipfsCid).to.equal("QmSecond");
    });

    it("Should revert when accessing out of bounds index", async function () {
      const prn = "PRN2024004";
      
      await expect(transcriptLedger.getTranscriptByIndex(prn, 0))
        .to.be.revertedWith("Index out of bounds");
    });
  });
});
