import { InputGroup } from "heroui-native/input-group";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { useMemo } from "react";
import { Text, View } from "react-native";

import { User } from "../icons/user";

interface FieldTileProps {
  addLabel?: string;
  className?: string;
  editLabel?: string;
  Icon?: React.ComponentType;
  isEditable?: boolean;
  isVerified?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "url"
    | "number-pad"
    | "decimal-pad"
    | "visible-password"
    | "ascii-capable"
    | "numbers-and-punctuation"
    | "name-phone-pad"
    | "twitter"
    | "web-search";
  maxLength?: number;
  onActionPress?: () => void;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  value?: string | null;
}

interface RightActionButtonProps {
  addLabel?: string;
  editLabel?: string;
  isEditable?: boolean;
  isVerified?: boolean;
  onPress?: () => void;
  value?: boolean;
}

const RightActionButton = (props: RightActionButtonProps) => {
  if (!props.isEditable) {
    return null;
  }

  const isFilled = props.value;
  let label = props.addLabel ?? "Add";

  if (isFilled) {
    label = props.isVerified ? "Verified" : (props.editLabel ?? "Edit");
  }

  const isSuccess = props.isVerified;

  return (
    <PressableFeedback isDisabled={props.isVerified} onPress={props.onPress}>
      <View
        className={`rounded-2xl px-3 py-1 ${
          isSuccess
            ? "border border-green-500 bg-green-50"
            : "border border-accent"
        }`}
      >
        <Text
          className={`font-medium text-sm ${
            isSuccess ? "text-green-600" : "text-accent"
          }`}
        >
          {label}
        </Text>
      </View>
    </PressableFeedback>
  );
};

export const FieldTile = (props: FieldTileProps) => {
  const isValue = useMemo(() => (props.value ?? "").length > 0, [props.value]);
  const IconComponent = props.Icon ?? User;

  return (
    <InputGroup>
      <InputGroup.Prefix>
        <IconComponent className={isValue ? "text-accent" : "text-accent/50"} />
      </InputGroup.Prefix>

      <InputGroup.Input
        editable={!props.isVerified}
        keyboardType={props.keyboardType}
        maxLength={props.maxLength}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderColorClassName="gray"
        value={props.value ?? ""}
      />

      {props.isEditable && (
        <InputGroup.Suffix>
          <RightActionButton
            addLabel={props.addLabel}
            editLabel={props.editLabel}
            isEditable={props.isEditable}
            isVerified={props.isVerified}
            onPress={props.onActionPress}
            value={isValue}
          />
        </InputGroup.Suffix>
      )}
    </InputGroup>
  );
};
