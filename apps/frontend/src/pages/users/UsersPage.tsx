import { useEffect, useState } from "react";
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
  FloatingFocusManager,
  useId,
  useTransitionStyles,
} from "@floating-ui/react";

type User = {
  firstName: string;
  lastName: string;
  favorites: {
    lion: string;
    fish: string;
  };
  dob: Date;
};

const UserItem = ({ firstName, lastName, dob, favorites }: User) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(10),
      flip({ fallbackAxisSideDirection: "end" }),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });
  const { isMounted, styles } = useTransitionStyles(context);

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const headingId = useId();

  const dobDate = new Date(dob);

  return (
    <div style={{ marginBottom: 8 }}>
      <button
        ref={refs.setReference}
        style={{
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 16,
          paddingRight: 16,
        }}
        {...getReferenceProps()}
      >
        <span>{firstName}</span> <span>{lastName}</span>
      </button>
      {isOpen && isMounted && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              ...styles,
              width: "max-content",
              maxWidth: "max-content",
              backgroundColor: "white",
              border: "1px solid #ddd",
              fontSize: "90%",
              padding: "4px 8px",
              borderRadius: "4px",
              textAlign: "left",
            }}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <ul>
              <li>
                {firstName} {lastName}
              </li>
              <li>
                {dobDate.getUTCDate()}/{dobDate.getUTCMonth()}/
                {dobDate.getUTCFullYear()}
              </li>
              <li>favorite lion {favorites.lion}</li>
              <li>favorite fish {favorites.fish}</li>
            </ul>
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
};

export const UsersPage = () => {
  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");

        const data = await (await response).json();
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

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {users?.map((user: User, i) => {
        return (
          <UserItem key={`${user.firstName}${user.lastName}${i}`} {...user} />
        );
      })}
    </div>
  );
};
