import { ChangeEvent, useState, memo } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useInteractions,
  useHover,
  FloatingFocusManager,
  useId,
  useTransitionStyles
} from '@floating-ui/react';

/**
 * User Item
 * Show single user as a list item
 */

type Favorites = {
  lion: string;
  fish: string;
};

type User = {
  _id: string;
  dp: string;
  firstName: string;
  lastName: string;
  favorites: Favorites;
  dob: Date;
};

type TUserItem = {
  isSelected: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  user: User;
};

const UserItem = ({ user, isSelected, onChange }: TUserItem) => {
  const { _id, dp, firstName, lastName, dob, favorites } = user;

  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip({ fallbackAxisSideDirection: 'end' }), shift()],
    whileElementsMounted: autoUpdate
  });

  const { isMounted, styles } = useTransitionStyles(context);

  const hover = useHover(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss, role]);
  const headingId = useId();
  const dobDate = new Date(dob);

  return (
    <div className={['user-item', 'inline', isSelected ? 'selected' : undefined].join(' ')} data-cy={_id}>
      <input onChange={onChange} checked={isSelected} id={`select-${_id}`} type="checkbox" />
      <label htmlFor={`select-${_id}`} ref={refs.setReference} {...getReferenceProps()} className="inline">
        <img src={dp} height={48} width={48} alt="" className="round" />
        <strong>{firstName}</strong>
      </label>
      {isOpen && isMounted ? (
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            className="user-item-more"
            style={{
              ...floatingStyles,
              ...styles
            }}
            aria-labelledby={headingId}
            {...getFloatingProps()}>
            <div className="stack">
              <div className="inline">
                <img src={user.dp} height={96} width={96} alt="" className="round" />
                <strong>{`${firstName} ${lastName}`}</strong>
              </div>
              <div>
                <span className="text-muted">DOB:</span> {dobDate.getUTCDate()}/{dobDate.getUTCMonth()}/
                {dobDate.getUTCFullYear()}
              </div>

              <ul className="stack-half" role="list">
                <li>
                  <strong>Favourites</strong>
                </li>
                <li>
                  <span className="text-muted">Lion:</span> {favorites.lion}
                </li>
                <li>
                  <span className="text-muted">Fish:</span> {favorites.fish}
                </li>
              </ul>
            </div>
          </div>
        </FloatingFocusManager>
      ) : null}
    </div>
  );
};

export default memo(UserItem);
export type { User };
