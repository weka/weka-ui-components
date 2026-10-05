import type { CapacityAmountValue } from '../../inputs/CapacityAmountInput'
import type {
  FieldPath,
  FieldValues,
  RegisterOptions,
  Validate
} from 'react-hook-form'

import { EMPTY_STRING } from '#v2/utils/consts'

const REQUIRED_VALIDATOR_KEY = 'capacityRequired'

function requiredMessage(required: RegisterOptions['required']): string {
  if (typeof required === 'string') {
    return required
  }
  if (typeof required === 'object') {
    return required.message
  }
  return EMPTY_STRING
}

export function hasCapacityNumber(value: unknown): boolean {
  const number = (value as CapacityAmountValue | undefined)?.number
  return number !== undefined && number !== null && !Number.isNaN(number)
}

/**
 * A capacity field's value is always an object, which react-hook-form's
 * `required` rule treats as filled. The rule is rewritten into a validator
 * on the number part so an empty field fails with the same message.
 */
export function withCapacityRequired<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(
  rules: RegisterOptions<TFieldValues, TName> | undefined
): RegisterOptions<TFieldValues, TName> | undefined {
  if (!rules?.required) {
    return rules
  }
  const { required, validate, ...rest } = rules
  const message = requiredMessage(required)
  const requiredValidator: Validate<unknown, TFieldValues> = (value) =>
    hasCapacityNumber(value) || message
  const validators =
    typeof validate === 'function' ? { value: validate } : validate ?? {}

  return {
    ...rest,
    validate: { [REQUIRED_VALIDATOR_KEY]: requiredValidator, ...validators }
  } as RegisterOptions<TFieldValues, TName>
}
