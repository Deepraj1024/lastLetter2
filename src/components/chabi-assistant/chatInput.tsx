import type {
  Control,
  UseFormHandleSubmit,
  UseFormWatch,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Icon } from "@/components/icons";
import { AltArrowRight } from "@/components/icons/alt-arrow-right";
import { AskAi } from "@/components/icons/ask-ai";

interface ChatFormValues {
  message: string;
}

interface ChatInputBarProps {
  control: Control<ChatFormValues>;
  disabled?: boolean;
  handleSubmit: UseFormHandleSubmit<ChatFormValues>;
  onInputChange: (text: string) => void;
  onSend: (text: string) => void;
  watch: UseFormWatch<ChatFormValues>;
}

export default function ChatInputBar({
  onSend,
  onInputChange,
  disabled,
  control,
  handleSubmit,
  watch,
}: ChatInputBarProps) {
  const messageValue = watch("message");

  const onSubmit = (data: ChatFormValues) => {
    onSend(data.message);
  };

  const hasText = messageValue && messageValue.trim().length > 0 && !disabled;

  return (
    <View className="border-border/10 border-t bg-background/95 px-4 pt-3 pb-5">
      <View
        className={`flex-row items-center rounded-2xl border border-continuous bg-surface-secondary/80 px-3 py-1.5 shadow-md transition-all ${
          hasText
            ? "border-accent/50 shadow-accent/5 shadow-sm"
            : "border-border/20"
        }`}
      >
        {/* Active AI branding anchor */}
        <View className="pr-2 pl-1">
          <Icon
            className="size-4.5"
            color="accent"
            icon={AskAi}
            withWrapper={false}
          />
        </View>

        <Controller
          control={control}
          name="message"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="flex-1 py-2 font-normal text-[15px] text-foreground"
              editable={!disabled}
              onChangeText={(text) => {
                onChange(text);
                onInputChange(text);
              }}
              onSubmitEditing={handleSubmit(onSubmit)}
              placeholder="Ask Chabi anything..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              returnKeyType="send"
              value={value}
            />
          )}
        />

        <TouchableOpacity
          activeOpacity={0.85}
          className={`ml-1 h-9.5 w-9.5 items-center justify-center rounded-xl transition-all ${
            hasText ? "bg-accent shadow-accent/20 shadow-md" : "bg-transparent"
          }`}
          disabled={!hasText}
          onPress={handleSubmit(onSubmit)}
        >
          <Icon
            className="size-4"
            color={hasText ? "primary" : "muted"}
            icon={AltArrowRight}
            withWrapper={false}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
