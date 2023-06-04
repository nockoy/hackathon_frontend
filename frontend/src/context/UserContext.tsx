import { useState, createContext, ReactNode, useEffect } from "react";

type Props = {
    children: ReactNode;
};

type UserContextType = {
    id: string;
    name: string;
    icon: string;
    channel: string;
    setUser: (id: string, name: string, icon: string, channel: string) => void;
};

export const UserContext = createContext<UserContextType>({
    id: "",
    name: "",
    icon: "",
    channel: "",
    setUser: () => { },
});

export const UserProvider = ({ children }: Props) => {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("");
    const [channel, setChannel] = useState("");

    useEffect(() => {
        // ローカルストレージからユーザー情報を取得
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            const { id, name, icon, channel } = JSON.parse(savedUser);
            setUser(id, name, icon, channel);
        }
    }, []);

    const setUser = (id: string, name: string, icon: string, channel: string): void => {
        setId(id);
        setName(name);
        setIcon(icon);
        setChannel(channel);

        // ユーザー情報をローカルストレージに保存
        localStorage.setItem("user", JSON.stringify({ id, name, icon, channel }));
    };

    const value = {
        id,
        name,
        icon,
        channel,
        setUser,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
