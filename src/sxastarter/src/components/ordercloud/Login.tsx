/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Card,
  CardBody,
  Checkbox,
  FormControl,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react'
import { Field, LinkField, RichText } from '@sitecore-jss/sitecore-jss-nextjs'
import { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import login from '../../redux/ocAuth/login'
import { useOcDispatch, useOcSelector } from '../../redux/ocStore'

interface Fields {
  Title: Field<string>
  UserName: Field<string>
  Password: Field<string>
  UserNameWaterMark: Field<string>
  PasswordWaterMark: Field<string>
  ErrorMessage: Field<string>
  StaySignedInMessage: Field<string>
  RegisterMessage: Field<string>
  SubmitButton: LinkField
}

type LoginProps = {
  params: { [key: string]: string }
  fields: Fields
  onLoggedIn: () => void
}

export const Default = (props: LoginProps): JSX.Element => {
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : ''
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd()
  const router = useRouter()

  const dispatch = useOcDispatch()

  const { loading, error, isAnonymous } = useOcSelector((s: any) => ({
    isAnonymous: s.ocAuth.isAnonymous,
    error: s.ocAuth.error,
    loading: s.ocAuth.loading,
  }))

  const [formValues, setFormValues] = useState({
    identifier: '',
    password: '',
    remember: false,
  })

  const handleInputChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({ ...v, [fieldKey]: e.target.value }))
  }

  const handleCheckboxChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({ ...v, [fieldKey]: !!e.target.checked }))
  }

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      dispatch(
        login({
          username: formValues.identifier,
          password: formValues.password,
          remember: formValues.remember,
        })
      )
    },
    [formValues, dispatch]
  )

  useEffect(() => {
    if (!isAnonymous) {
      router.push('/')
    }
  }, [router, isAnonymous])

  return (
    <Card
      as="form"
      name="ocLoginForm"
      onSubmit={handleSubmit}
      variant="filled"
      p={3}
      w="full"
      maxW="450px"
    >
      <CardBody
        as={VStack}
        alignItems="flex-start"
        className={`component container ${styles}`}
        gap={5}
      >
        {props.fields.Title && (
          <Heading
            as={RichText}
            field={props.fields.Title}
          />
        )}
        {error && (
          <Alert status="warning">
            <AlertIcon />
            <AlertDescription fontSize="1em">{props.fields.ErrorMessage.value}</AlertDescription>
          </Alert>
        )}
        <FormControl>
          {props.fields.UserName && <RichText field={props.fields.UserName} />}
          <Input
            mt={2}
            type="text"
            id="identifier"
            name="identifier"
            placeholder={props.fields.UserNameWaterMark.value}
            value={formValues.identifier}
            onChange={handleInputChange('identifier')}
            required
            size="md"
          />
        </FormControl>
        <FormControl
          w="100%"
          width="full"
        >
          {props.fields.Password && <RichText field={props.fields.Password} />}
          <Input
            mt={2}
            type="password"
            id="password"
            name="password"
            placeholder={props.fields.PasswordWaterMark.value}
            value={formValues.password}
            onChange={handleInputChange('password')}
            required
            size="md"
          />
        </FormControl>

        {props.fields.StaySignedInMessage && (
          <Checkbox
            checked={formValues.remember}
            onChange={handleCheckboxChange('remember')}
          >
            <RichText field={props.fields.StaySignedInMessage} />
          </Checkbox>
        )}

        <Button
          title={props?.fields?.SubmitButton?.value?.title}
          disabled={loading}
          type="submit"
          colorScheme="green"
          w="full"
        >
          {props?.fields?.SubmitButton?.value?.text}
        </Button>

        {props.fields.RegisterMessage && <RichText field={props.fields.RegisterMessage} />}
      </CardBody>
    </Card>
  )
}
