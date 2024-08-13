import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  UseDisclosureProps,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import {
  Order,
  OrderApprovalInfo,
  Orders,
} from 'ordercloud-javascript-sdk'
import React, { useCallback, useMemo } from 'react'

interface OrderApprovalModalProps {
  order: Order
  type: 'approve' | 'decline'
  disclosure: UseDisclosureProps
}

export const OrderApprovalModal = (props: OrderApprovalModalProps): JSX.Element => {
  const router = useRouter()
  const [comments, setComments] = React.useState<string>('')

  const toast = useToast()

  const handleApprove = useCallback(async () => {
    try {
      const requestBody = { AllowResubmit: false, Comments: comments } as OrderApprovalInfo
      await Orders.Approve('All', props.order.ID, requestBody)
      // route back to order approval list page
      router.push(`/my-profile/my-order-approvals`)
    } catch (ex) {
      toast({
        title: 'Approval Error',
        description: ex.message,
        status: 'error',
        duration: 5000,
        position: 'top',
      })
    }
  }, [comments, props.order?.ID, router, toast])

  const handleDecline = useCallback(async () => {
    try {
      const requestBody = { AllowResubmit: true, Comments: comments } as OrderApprovalInfo
      await Orders.Decline('All', props.order.ID, requestBody)
      // route back to order approval list page
      router.push(`/my-profile/my-order-approvals`)
    } catch (ex) {
      toast({
        title: 'Decline Error',
        description: ex.message,
        status: 'error',
        duration: 5000,
        position: 'top',
      })
    }
  }, [comments, props.order?.ID, router, toast])

  const formattedType = useMemo(
    () => props.type.charAt(0).toUpperCase() + props.type.slice(1),
    [props.type]
  )

  const handleClose = useCallback(() => {
    setComments('')
    props.disclosure.onClose()
  }, [props.disclosure])

  return (
    <Modal
      isOpen={props.disclosure.isOpen}
      onClose={props.disclosure.onClose}
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Order {props.type === 'approve' ? 'Approval' : 'Decline'} Comments
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            placeholder="Optional comments"
            onChange={(e) => setComments(e.target.value)}
            value={comments}
          ></Textarea>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => (props.type === 'approve' ? handleApprove() : handleDecline())}
          >
            {formattedType}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
