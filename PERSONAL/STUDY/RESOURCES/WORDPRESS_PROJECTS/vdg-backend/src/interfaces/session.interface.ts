interface Cookie {
    path: string
    _expires: Date | null
    originalMaxAge: number | string | null,
    httpOnly: boolean,
    secure: boolean,
}

interface User {
    sessionId: string,
}

export interface Session {
    cookie?: Cookie,
    user: User,
}

export interface RequestedDataInterface {
    user: User,
    session: Session | any,
    body: any,
}

export interface isSessionExpiredInterface {
    user: User,
    isNotExpired: boolean,
}
