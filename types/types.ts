interface TCPPacket {
    srcPort: number;
    destPort: number;
    seqNum: number;
    ackNum: number;
    dataOffset: number;
    flags: number;
    windowSize: number;
    checksum: number;
    urgentPointer: number;
    options: number[];
    data: Buffer;
} 

export { TCPPacket };  