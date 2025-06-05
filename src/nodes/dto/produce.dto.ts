export class Produce {
    AccountID?: string;
    AppraisedValue?: number;
    Category?: string;
    CreatedDate?: string;
    ID?: string;
    ImageUrl?: string;
    MarketPrice?: string;
    Name?: string;
    Owner?: string;
    ProduceID?: string;
    ProduceType?: string;
    PublicDescription?: string;
    Salt?: string;
    Species?: string;
    TradingCertificateUrl?: string;
    TradingStatus?: string;
    WarehouseCertificateUrl?: string;
    Weight?: string;
}

export class CreateProduceDto {
    id: string;
    accountID: string;
    appraisedValue: number;
    produceType: string;
    category: string;
    produceID: string;
    createdDate: string;
    imageUrl: string;
    marketPrice: string;
    name: string;
    owner: string;
    publicDescription: string;
    salt: string;
    species: string;
    tradingCertificateUrl: string;
    tradingStatus: string;
    warehouseCertificateUrl: string;
    weight: string;
}

export class UpdateProduceDto extends CreateProduceDto { }

export class TransferProduceDto {
    id: string;
    newOwner: string;
}

export class ProduceInput {
    accountID?: string;
    appraisedValue?: number;
    category?: string;
    createdDate?: string;
    id?: string;
    imageUrl?: string;
    marketPrice?: string;
    name?: string;
    owner?: string;
    produceID?: string;
    produceType?: string;
    publicDescription?: string;
    salt?: string;
    species?: string;
    tradingCertificateUrl?: string;
    tradingStatus?: string;
    warehouseCertificateUrl?: string;
    weight?: string;
}

export class TransferProduceInput {
    id: string;
    newOwner: string;
}

export class ProduceResponse {
    AccountID?: string;
    AppraisedValue?: number;
    Category?: string;
    CreatedDate?: string;
    ID?: string;
    ImageUrl?: string;
    MarketPrice?: string;
    Name?: string;
    Owner?: string;
    ProduceID?: string;
    ProduceType?: string;
    PublicDescription?: string;
    Salt?: string;
    Species?: string;
    TradingCertificateUrl?: string;
    TradingStatus?: string;
    WarehouseCertificateUrl?: string;
    Weight?: string;
}

export class OperationResponse {
    created?: string;
    detail?: any;
    error?: string;
    id?: string;
    input?: any;
    namespace?: string;
    output?: any;
    plugin?: string;
    retry?: string;
    status?: string;
    tx?: string;
    type?: string;
    updated?: string;
}

export class ListenerOptions {
    firstEvent?: string;
}

export class CreateListenerDto {
    name?: string;
    options?: ListenerOptions;
    topic?: string;
}

export class ListenerResponse {
    backendId?: string;
    created?: string;
    event?: any;
    filters?: any[];
    id?: string;
    interface?: any;
    location?: any;
    name?: string;
    namespace?: string;
    options?: ListenerOptions;
    signature?: string;
    topic?: string;
}