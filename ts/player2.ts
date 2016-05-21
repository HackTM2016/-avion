class Player {
    name:string;
    status:string;
}

interface PlayerAuth
{
    login(name, callback: (success : boolean) => void);
    logout();
}
