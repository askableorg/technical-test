import { ChangeEvent, useEffect, useState } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  useHover,
  FloatingFocusManager,
  useId,
  useTransitionStyles,
} from '@floating-ui/react';

type Props = {
  isSelected: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  user: {
    _id: string;
    dp: string;
    firstName: string;
    lastName: string;
    favorites: {
      lion: string;
      fish: string;
    };
    dob: Date;
  };
};

const UserItem = ({ user, isSelected, onChange }: Props) => {
  const { firstName, lastName, dob, favorites } = user;

  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip({ fallbackAxisSideDirection: 'end' }), shift()],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles } = useTransitionStyles(context);

  const hover = useHover(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss, role]);

  const headingId = useId();

  const dobDate = new Date(dob);

  return (
    <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <input onChange={onChange} checked={isSelected} type="checkbox" />
      <div ref={refs.setReference} {...getReferenceProps()} style={{ display: 'flex' }}>
        <img src={user.dp} height={50} style={{ borderRadius: '100%', marginRight: 12, marginLeft: 12 }} width={50} />
        <h3>{firstName}</h3>
      </div>
      {isOpen && isMounted && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              ...styles,
              width: 'max-content',
              maxWidth: 'max-content',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              fontSize: '90%',
              padding: '4px 8px',
              borderRadius: '4px',
              textAlign: 'left',
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
                <li>
                  {dobDate.getUTCDate()}/{dobDate.getUTCMonth()}/{dobDate.getUTCFullYear()}
                </li>
                <li>favorite lion {favorites.lion}</li>
                <li>favorite fish {favorites.fish}</li>
              </ul>
            </div>
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
};

export const UsersPage = () => {
  const [users, setUsers] = useState<Props['user'][] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/users');

        const data = await response.json();
        setUsers(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUsers();
  }, []);

  if (users === null) {
    return <div>Loading...</div>;
  }

  const selectedUser = users.find((user) => user._id === selected);

  const handleChange = (id: string) => {
    setSelected(id);
  };

  const filteredUsers = users.filter((user) => {
    return user.firstName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', width: '100%' }}>
        <h1>Selected user: {selectedUser?.firstName ?? 'No user selected'}</h1>
        <input onChange={(e) => setSearch(e.target.value)} placeholder="Search..." style={{ marginBottom: 20 }} />
      </div>
      {filteredUsers?.map((user) => {
        return <UserItem onChange={() => handleChange(user._id)} user={user} isSelected={selected === user?._id} />;
      })}
    </div>
  );
};
