import React from "react";

type DeleteConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onDeleteConfirm: () => void;
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onDeleteConfirm,
}) => {
    if (!isOpen) return null;

    return (
        <div className="delete-confirmation-modal">
            <h3>Are you sure you want to delete this product?</h3>
            <button className="cancel-button" onClick={onClose}>
                Cancel
            </button>
            <button className="confirm-delete-button" onClick={onDeleteConfirm}>
                Delete
            </button>
        </div>
    );
};

export default DeleteConfirmationModal;
