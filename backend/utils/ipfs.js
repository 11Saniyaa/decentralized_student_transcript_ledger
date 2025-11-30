const axios = require("axios");
const FormData = require("form-data");

function getPinataCredentials() {
  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_API_KEY;
  
  if (!apiKey || !secretKey) {
    return null; // Return null if not set - will use mock IPFS
  }
  
  return { apiKey, secretKey };
}

// Note: Pinata is now required - no mock IPFS fallback

async function uploadToIPFS(fileBuffer, fileName) {
  try {
    const credentials = getPinataCredentials();
    
    // Pinata is required for transcript uploads
    if (!credentials) {
      throw new Error(
        "Pinata API credentials not configured. Please set PINATA_API_KEY and PINATA_SECRET_API_KEY in your .env file. " +
        "Get your keys from: https://app.pinata.cloud/"
      );
    }
    
    // Use Pinata for IPFS upload
    const { apiKey, secretKey } = credentials;
    console.log("📤 Uploading to Pinata IPFS...");
    
    // Create form data
    const formData = new FormData();
    formData.append("file", fileBuffer, {
      filename: fileName,
      contentType: "application/pdf",
    });
    
    // Pinata metadata
    const metadata = JSON.stringify({
      name: fileName,
    });
    formData.append("pinataMetadata", metadata);
    
    // Pinata options
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);

    // Upload to Pinata
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        maxContentLength: "Infinity",
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretKey,
        },
      }
    );

    const cid = response.data.IpfsHash;
    console.log(`✅ Successfully uploaded to Pinata IPFS! CID: ${cid}`);

    // Construct IPFS gateway URLs (prioritize Pinata gateway for reliability)
    const ipfsUrl = `https://ipfs.io/ipfs/${cid}`;
    const pinataGatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
    const dwebUrl = `https://${cid}.ipfs.dweb.link/${fileName}`;

    return {
      cid: cid,
      ipfsUrl: pinataGatewayUrl, // Use Pinata gateway as primary (more reliable)
      pinataGatewayUrl: pinataGatewayUrl,
      dwebUrl: dwebUrl,
    };
  } catch (error) {
    console.error("❌ Error uploading to Pinata IPFS:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      throw new Error("Pinata authentication failed. Please check your API keys in .env file.");
    } else if (error.response?.status === 403) {
      throw new Error("Pinata access denied. Please verify your API keys have correct permissions.");
    }
    throw new Error(`Failed to upload to Pinata: ${error.response?.data?.error?.details || error.message}`);
  }
}

module.exports = {
  uploadToIPFS,
};
