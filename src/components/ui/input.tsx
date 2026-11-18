import { Button } from 'heroui-native/button';
import { Description } from 'heroui-native/description';
import { FieldError } from 'heroui-native/field-error';
import { useBottomSheetAwareHandlers } from 'heroui-native/hooks';
import { InputGroup } from 'heroui-native/input-group';
import { Label } from 'heroui-native/label';
import { TextField } from 'heroui-native/text-field';
import type { ComponentProps, FC } from 'react';
import { useCallback, useState } from 'react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';
import { useController } from 'react-hook-form';
import type { KeyboardType, TextInput } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import type { ClassNameValue } from 'tailwind-merge';

import { cn } from '@/utils/style';

import { Icon } from '../icons';
import { Eye } from '../icons/eye';
import { EyeClosed } from '../icons/eye-closed';

interface ControlledInputProps<
  T extends FieldValues,
> extends UseControllerProps<T> {
  autoCapitalize?: ComponentProps<typeof TextInput>['autoCapitalize'];
  autoComplete?: ComponentProps<typeof TextInput>['autoComplete'];
  autoCorrect?: ComponentProps<typeof TextInput>['autoCorrect'];
  autoFocus?: boolean;
  className?: ClassNameValue;
  color?: 'default' | 'light' | 'surface';
  description?: string;
  descriptionClassName?: ClassNameValue;
  endComponent?: FC;
  endIcon?: FC<SvgProps>;
  isInsideBottomSheet?: boolean;
  isSecure?: boolean;
  keyboardType?: KeyboardType;
  label?: string;
  labelClassName?: ClassNameValue;
  maxLength?: number;
  minLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  onChangeTextCustom?: (value: string) => string;
  onSubmitEditing?: ComponentProps<typeof TextInput>['onSubmitEditing'];
  placeholder?: string;
  readOnly?: boolean;
  returnKeyLabel?: ComponentProps<typeof TextInput>['returnKeyLabel'];
  returnKeyType?: ComponentProps<typeof TextInput>['returnKeyType'];
  size?: 'sm' | 'md' | 'lg';
  startComponent?: FC;
  startIcon?: FC<SvgProps>;
  submitBehavior?: ComponentProps<typeof TextInput>['submitBehavior'];
}

// oxlint-disable-next-line complexity
export const Input = <T extends FieldValues>(
  props: ControlledInputProps<T>
) => {
  const {
    field: { onChange, onBlur, value, disabled },
    fieldState: { error, invalid },
  } = useController({
    control: props.control,
    defaultValue: props.defaultValue,
    disabled: props.disabled,
    exact: props.exact,
    name: props.name,
    rules: props.rules,
    shouldUnregister: props.shouldUnregister,
  });

  const [isNotVisible, setIsNotVisible] = useState(props.isSecure ?? false);
  const StartIcon = props.startIcon ?? Eye;
  const EndIcon = props.endIcon ?? Eye;

  const { onBlur: onBottomSheetBlur, onFocus: onBottomSheetFocus } =
    useBottomSheetAwareHandlers();

  const onPress = useCallback(() => {
    setIsNotVisible((prev) => !prev);
  }, []);

  const EndIconRender = useCallback(() => {
    if (props.endIcon) {
      return (
        <Icon color="accent" icon={EndIcon} size="sm" variants="transparent" />
      );
    }

    if (props.isSecure) {
      return (
        <Button isIconOnly onPress={onPress} size="sm" variant="ghost">
          <Icon
            color="accent"
            icon={isNotVisible ? Eye : EyeClosed}
            size="sm"
            variants="transparent"
          />
        </Button>
      );
    }

    return null;
  }, [EndIcon, isNotVisible, onPress, props.endIcon, props.isSecure]);

  return (
    <TextField
      isDisabled={disabled}
      isRequired={props.rules?.required === true}
    >
      {props?.label ? (
        <Label
          isDisabled={props?.disabled}
          isInvalid={invalid}
          isRequired={props.rules?.required === true}
        >
          <Label.Text className={cn('capitalize', props.labelClassName)}>
            {props?.label}
          </Label.Text>
        </Label>
      ) : null}

      <InputGroup isDisabled={disabled}>
        {props.startIcon ? (
          <InputGroup.Prefix>
            <Icon
              color="accent"
              icon={StartIcon}
              size="sm"
              variants="transparent"
              withWrapper={false}
            />
          </InputGroup.Prefix>
        ) : null}

        {props.startComponent ? (
          <InputGroup.Prefix>
            <props.startComponent />
          </InputGroup.Prefix>
        ) : null}

        <InputGroup.Input
          autoCapitalize={props.autoCapitalize}
          autoComplete={props.autoComplete}
          autoCorrect={props.autoCorrect}
          autoFocus={props.autoFocus}
          className={cn(
            'h-14 border-2 font-normal text-base leading-tight',
            props.startIcon || props.startComponent ? 'pl-10' : '',
            invalid
              ? 'border-danger-soft-foreground bg-danger-soft focus:border-danger-soft-foreground'
              : 'border-border bg-surface focus:border-accent focus:bg-surface-secondary',
            props.className
          )}
          editable={!(props.readOnly || disabled)}
          keyboardType={props.keyboardType}
          maxLength={props.maxLength}
          multiline={props.multiline}
          numberOfLines={props.numberOfLines}
          onBlur={props?.isInsideBottomSheet ? onBottomSheetBlur : onBlur}
          onChangeText={(text) => {
            if (props.onChangeTextCustom) {
              return onChange(props.onChangeTextCustom(text));
            }
            return onChange(text);
          }}
          onFocus={props?.isInsideBottomSheet ? onBottomSheetFocus : undefined}
          onSubmitEditing={props.onSubmitEditing}
          placeholder={props?.placeholder}
          placeholderColorClassName="accent-muted"
          returnKeyLabel={props.returnKeyLabel}
          returnKeyType={props.returnKeyType}
          secureTextEntry={isNotVisible}
          submitBehavior={props.submitBehavior}
          value={value?.toString() ?? ''}
        />

        {props.endComponent ? (
          <InputGroup.Suffix>
            <props.endComponent />
          </InputGroup.Suffix>
        ) : null}

        {props.isSecure || props.endIcon ? (
          <InputGroup.Suffix>{EndIconRender()}</InputGroup.Suffix>
        ) : null}
      </InputGroup>

      {props?.description && (
        <Description
          className={cn(props.descriptionClassName)}
          disabled={disabled}
        >
          {props?.description}
        </Description>
      )}

      <FieldError isInvalid={invalid}>{error?.message}</FieldError>
    </TextField>
  );
};
