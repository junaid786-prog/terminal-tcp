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

type CommandResponse = {
    success: boolean;
    message: string;
    data: any;
}

type Command = {
    data: any;
    type: string;
}


export { TCPPacket, CommandResponse, Command };  