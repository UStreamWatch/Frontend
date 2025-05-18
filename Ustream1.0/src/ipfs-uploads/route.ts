import { NextResponse, NextRequest } from "next/server";
import { PinataSDK } from "pinata-web3";

export async function POST(request: NextRequest) {
  try {
    // Initialize Pinata with environment variables
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
      pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
    });

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" }, 
        { status: 400 }
      );
    }

    // Get metadata from form data
    const pinataMetadataString = data.get("pinataMetadata") as string;
    let pinataMetadata;
    try {
      pinataMetadata = pinataMetadataString ? JSON.parse(pinataMetadataString) : {};
    } catch (parseError) {
      console.error("Error parsing Pinata metadata:", parseError);
      pinataMetadata = {};
    }

    // Upload file to Pinata
    const uploadData = await pinata.upload.file(file, pinataMetadata);
    const url = await pinata.gateways.convert(uploadData.IpfsHash);
    
    // Return the response with URLs
    return NextResponse.json({
      fileUrl: url,
      metadataUrl: `https://gateway.pinata.cloud/ipfs/${uploadData.IpfsHash}`,
      ipfsHash: uploadData.IpfsHash
    }, { status: 200 });

  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: e instanceof Error ? e.message : "Unknown error" 
      }, 
      { status: 500 }
    );
  }
}