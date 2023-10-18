import { useEffect, useState } from 'react';
import { FixedSizeList } from 'react-window';
import { useUsersQuery } from '@/api/useUsersQuery';
import { getErrorMessage } from '@/utils';
import UserItem from '@/components/UserItem';
import type { User } from '@/components/UserItem';

const itemHeight = 72;

const UsersPage = () => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<User | null>(null);
  const [listHeight, setListHeight] = useState<number>(700);

  const { fetchUsers } = useUsersQuery();
  const { data: users, isLoading, isError, error } = fetchUsers();

  useEffect(() => {
    if (!users) {
      return;
    }

    if (search !== '') {
      // Filter users by search query
      const usersFound = users?.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase())
      );

      setFilteredUsers(usersFound ?? []);
      setListHeight(Math.min(window.innerHeight - 200, itemHeight * filteredUsers.length));
    } else {
      // List all users
      setFilteredUsers(users);
    }
  }, [users, search]);

  const handleChange = (id: string) => {
    // Select/deselect a single user
    if (selected?._id === id) {
      setSelected(null);
      return;
    }

    setSelected(users?.find((user) => user._id === id) ?? null);
  };

  return (
    <>
      <header className="stack-half sticky">
        <h1>Users {!isLoading ? <>({filteredUsers.length})</> : null}</h1>
        {!isLoading ? (
          <div className="inline inline-wrap">
            <input onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
            <div>
              Selected user: <strong>{selected?.firstName ?? 'No user selected'}</strong>
            </div>
          </div>
        ) : null}
      </header>

      <main className="stack">
        {isError ? <div className="callout critical">{getErrorMessage(error)}</div> : null}
        {isLoading ? <div className="callout">Loading...</div> : null}
        {users && users.length > 0 ? (
          <FixedSizeList
            innerElementType="ul"
            className="v-list"
            itemCount={filteredUsers.length}
            itemSize={itemHeight}
            width={window.innerWidth - 24}
            height={listHeight}>
            {({ index, style, isScrolling }) => (
              <li style={style}>
                {isScrolling ? (
                  <div className="skeleton inline">
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  <UserItem
                    isSelected={selected?._id === filteredUsers[index]?._id}
                    onChange={() => handleChange(filteredUsers[index]._id)}
                    user={filteredUsers[index]}
                  />
                )}
              </li>
            )}
          </FixedSizeList>
        ) : (
          <div className="callout">No users found</div>
        )}
      </main>
    </>
  );
};

export default UsersPage;
