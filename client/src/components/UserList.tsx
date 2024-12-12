import {useGameStore, useUserListStore, useUserStore} from "../stores/stores";
import {Box, List, ListItem, Typography} from "@mui/material";

export default function UserList() {
    const usernames = useUserListStore((state) => state.usernames);
    const playerRole = useGameStore(state => state.playerRole)
    const localName = useUserStore(state => state.username)

    return (
        <Box>
            <Typography variant="h5">Connected Users:</Typography>
            <List>
                {usernames.map((user) => {
                    const role = user === localName ? playerRole : "_";

                    // Define conditional styles based on role
                    const getRoleStyle = (role: string | null) => {
                        switch (role) {
                            case 'X':
                                return {color: '#D3302F'};
                            case 'O':
                                return {color: '#1876D2'};
                            default:
                                return {color: 'gray'};
                        }
                    };

                    return (
                        <ListItem
                            key={user}
                            sx={{
                                ...getRoleStyle(role),
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                backgroundColor: role !== '_' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                                marginBottom: '4px',
                            }}
                        >
                            <Typography variant="body1">{user}</Typography>
                            <Typography variant="body2">{role}</Typography>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}