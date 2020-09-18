pragma solidity >=0.5.0;


// ----------------------------------------------------------------------------
// Safe maths
// ----------------------------------------------------------------------------
contract SafeMath {
    function safeAdd(uint a, uint b) public pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function safeMul(uint a, uint b) public pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function safeDiv(uint a, uint b) public pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}

// ----------------------------------------------------------------------------
// Owned contract
// ----------------------------------------------------------------------------
contract Owned {
    address public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }
    function acceptOwnership() public {
        require(msg.sender == newOwner);
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
}

// ----------------------------------------------------------------------------
// EtherTrust contract
// ----------------------------------------------------------------------------
contract EtherTrust is SafeMath, Owned{

    uint participants;

    uint totalCredits;

    mapping(address => uint) credits;

    mapping(address => uint) wTime;

    event logCredits(uint credits);

    uint devFee;

    constructor() payable public{
        participants = 0;
        totalCredits = 0;
        devFee = 0;
    }

    // Participant functions
    function deposit() public payable{
        require(msg.value >= 1000000000000000, "Not enough ether for any credits.");

        if(credits[msg.sender] < 1){
            participants++;
        }
        uint roll = 0;
        if(block.number - wTime[msg.sender] != 0){
            roll = (1800000000 * credits[msg.sender] * (block.number - wTime[msg.sender]) / 1000000000000000);
        }
        wTime[msg.sender] = block.number;
        devFee += (msg.value * 2) / 100;
        totalCredits += (msg.value / 1000000000000000) + roll;
        credits[msg.sender] += msg.value / 1000000000000000 + roll;

        //emit logCredits(devFee);
    }

    function getCredits(address sender) public view returns(uint){
        return credits[sender];
    }

    function viewWithdraw(address sender) public view returns(uint){
        uint eth = 1800000000 * credits[sender] * (block.number - wTime[sender]);
        uint claim;
        if(((2 * (address(this).balance / participants)) / 1000000000000000) < credits[sender]){
            claim = (block.number - wTime[sender]) * (((address(this).balance * 5) / 10000) / 6200);
        }
        else{
            claim = eth;
        }
        return claim;
    }

    function withdraw() public {
        uint eth = 1800000000 * credits[msg.sender] * (block.number - wTime[msg.sender]);
        uint claim;
        if(((2 * (address(this).balance / participants)) / 1000000000000000) < credits[msg.sender]){
            claim = (block.number - wTime[msg.sender]) * (((address(this).balance * 5) / 10000) / 6200);
        }
        else{
            claim = eth;
        }
        emit logCredits(claim);
        wTime[msg.sender] = block.number;
        msg.sender.transfer(claim);
    }

    // General contract functions
    function viewContractBalance() public view returns(uint){
        return address(this).balance;
    }

    function viewParticipants() public view returns(uint){
        return participants;
    }

    function viewWhaleStatus() public view returns(uint){
        if(participants == 0){return 0;}
        return (2 * (address(this).balance / participants)) / 1000000000000000;
    }

    function viewWhalePull() public view returns(uint){
        return (address(this).balance * 5) / 10000;
    }

    function viewTotalCredits() public view returns(uint){
        return totalCredits;
    }

    // Dev functions
    function devFeeBalance() public onlyOwner view returns(uint){
        return devFee;
    }

    function withdrawDevFee() public onlyOwner{
        uint a = devFee;
        devFee = 0;
        msg.sender.transfer(a);
    }
}
