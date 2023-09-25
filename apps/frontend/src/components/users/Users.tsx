import debounce from "lodash.debounce";
import React, { ChangeEvent, useState, useEffect, useCallback, useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useInteractions,
    useHover,
    useDismiss,
    useRole,
    FloatingFocusManager,
    useId,
    useTransitionStyles,
} from "@floating-ui/react";
import PageNumbers from "../pagination/PageNumbers";
import { User } from "../../types";

type UserItemProps = {
    isSelected: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    user: User;
};

type RenderRowProps = {
    index: number;
    style: React.CSSProperties;
};

const UserItem = ({ user, isSelected, onChange }: UserItemProps) => {
    const { firstName, lastName, dob, favorites } = user;

    const [isOpen, setIsOpen] = useState(false);
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [offset(10), flip({ fallbackAxisSideDirection: "end" }), shift()],
        whileElementsMounted: autoUpdate,
    });

    const { isMounted, styles } = useTransitionStyles(context);

    const hover = useHover(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss, role]);

    const headingId = useId();

    const [year, month, day] = dob.slice(0, 10).split("-");
    const formattedDate = `${day}/${month}/${year}`;

    return (
        <div className="user-list-item">
            <input onChange={onChange} checked={isSelected} type="checkbox" />
            <div ref={refs.setReference} {...getReferenceProps()} className="user-list-item-info">
                <img className="user-list-img" src={user.dp} height={50} width={50} />
                <h3>{firstName}</h3>
            </div>
            {isOpen && isMounted && (
                <FloatingFocusManager context={context} modal={false}>
                    <div
                        ref={refs.setFloating}
                        className="floating-card"
                        style={{
                            ...floatingStyles,
                            ...styles,
                        }}
                        aria-labelledby={headingId}
                        {...getFloatingProps()}
                    >
                        <div>
                            <img src={user.dp} height={100} width={100} />
                            <ul>
                                <li>
                                    {firstName} {lastName}
                                </li>
                                <li>{formattedDate}</li>
                                <li>favorite lion {favorites?.lion}</li>
                                <li>favorite fish {favorites?.fish}</li>
                            </ul>
                        </div>
                    </div>
                </FloatingFocusManager>
            )}
        </div>
    );
};

const Users = () => {
    const [users, setUsers] = useState<User[] | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(20);

    const debouncedSearch = useMemo(
        () =>
            debounce((query) => {
                setSearch(query);
            }, 300),
        []
    );

    const handleChange = useCallback((id: string) => {
        setSelected(id);
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:3000/users");
                const data = await response.json();
                setUsers(data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(
        () =>
            users
                ? users.filter((user) =>
                      user.firstName.toLowerCase().includes(search.toLowerCase())
                  )
                : [],
        [users, search]
    );

    const usersForCurrentPage = useMemo(() => {
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        return filteredUsers.slice(startIndex, endIndex);
    }, [filteredUsers, currentPage, usersPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleUsersPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setUsersPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const renderRow = useCallback(
        ({ index, style }: RenderRowProps) => {
            const user = usersForCurrentPage[index];
            return (
                <div style={style}>
                    <UserItem
                        key={user._id}
                        onChange={() => handleChange(user._id)}
                        user={user}
                        isSelected={selected === user._id}
                    />
                </div>
            );
        },
        [usersForCurrentPage, selected, handleChange]
    );

    return (
        <div className="user-container">
            <div className="sticky-header">
                <input
                    className="search-input"
                    onChange={(e) => debouncedSearch(e.target.value)}
                    placeholder="Search..."
                />
                <select
                    className="users-per-page-select"
                    value={usersPerPage}
                    onChange={handleUsersPerPageChange}
                >
                    {[10, 20, 50, 100].map((amount) => (
                        <option key={amount} value={amount}>
                            {amount} per page
                        </option>
                    ))}
                </select>
            </div>
            <div className="list-container">
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            width={width}
                            height={height}
                            itemCount={usersForCurrentPage.length}
                            itemSize={100}
                        >
                            {({ index, style }) => renderRow({ index, style })}
                        </List>
                    )}
                </AutoSizer>
            </div>
            <div className="pagination">
                <PageNumbers
                    currentPage={currentPage}
                    itemsPerPage={usersPerPage}
                    totalItems={filteredUsers.length}
                    handlePageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default Users;
