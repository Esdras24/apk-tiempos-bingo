export interface Results {
    tipo: string;
    datos: ResultData[];
}

export interface ResultData {
    registro: string;
    horario: string;
}

export interface TicketData {
    tiquete: string;
    horario: string;
    balance: string;
}