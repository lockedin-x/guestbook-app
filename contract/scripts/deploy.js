async function main() {
    console.log("Deploying GuestBook contract...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");
    
    const GuestBook = await ethers.getContractFactory("GuestBook");
    console.log("Deploying...");
    
    const guestBook = await GuestBook.deploy();
    await guestBook.waitForDeployment();
    
    const contractAddress = await guestBook.getAddress();
    
    console.log("\n✅ GuestBook deployed!");
    console.log("📍 Address:", contractAddress);
    console.log("🔗 BaseScan:", `https://basescan.org/address/${contractAddress}`);
    console.log("\n📤 Share with friends:", contractAddress);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });