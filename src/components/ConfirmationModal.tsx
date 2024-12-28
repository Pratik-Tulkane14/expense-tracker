import { Button, Flex, Modal } from "@mantine/core";
import { IconTrash, IconCancel } from "@tabler/icons-react";
interface handleFunction {
  handleClick: () => void;
  onClose: () => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isDeleteModalOpen: boolean) => void;
  handleDelete: () => void;
}
export default function ConfirmationModal({
  isDeleteModalOpen,
  onClose,
  handleDelete,
}: handleFunction) {
  return (
    <>
      <Modal
        opened={isDeleteModalOpen}
        onClose={onClose}
        title="Confirmation"
        centered
        size="md"
      >
        <h3>Are you sure want to delete this record?</h3>
        <Flex gap="md" mt="20px">
          <Button
            leftSection={<IconCancel size={14} />}
            color="gray"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            leftSection={<IconTrash size={14} />}
            color="red"
            variant="filled"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
