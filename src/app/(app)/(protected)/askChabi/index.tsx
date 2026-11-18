import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { ScrollView } from "react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import Animated2, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { z } from "zod";
import AiSuggestionDropdown from "@/components/chabi-assistant/AiSuggestionDropdown";
import ChatInputBar from "@/components/chabi-assistant/chatInput";
import {
  BASE_SUGGESTIONS,
  getCategoryIcon,
  renderSuggestionIcon,
} from "@/components/chabi-assistant/customIcons";
import GlowingLogo from "@/components/chabi-assistant/growingLogo";
import RichStat from "@/components/chabi-assistant/RichStat";
import SuggestionCard from "@/components/chabi-assistant/suggestionCard";
import TypingIndicator from "@/components/chabi-assistant/typingIndicator";
import { Profile } from "@/components/profile";
import { useConversation } from "@/hooks/use-conversation";
import { useSuggestion } from "@/hooks/use-suggestion";
import {
  useCategoriesQuestion,
  useConversationCategory,
} from "@/hooks/useCategories";

type Role = "ai" | "user";

interface Message {
  id: string;
  rich?: boolean;
  role: Role;
  text: string;
}

const MAX_SUGGESTIONS = 6;

const chatSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty"),
});
type ChatFormValues = z.infer<typeof chatSchema>;

const getGreeting = (): string => {
  const hr = new Date().getHours();
  if (hr < 12) {
    return "Good Morning";
  }
  if (hr < 17) {
    return "Good Afternoon";
  }
  return "Good Evening";
};

const renderFormattedText = (text: string) => {
  if (!text) {
    return null;
  }
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text
          className="font-bold text-accent"
          key={`bold-${index}-${part.length}`}
        >
          {part.slice(2, -2)}
        </Text>
      );
    }
    return part;
  });
};

export default function AskChabi() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const VISIBLE_CATEGORIES_COUNT = 5;

  const { data: categoriesData } = useConversationCategory();
  const { data: categoryQuestionsData } = useCategoriesQuestion(
    selectedCategory || ""
  );

  const { mutate: askChabi } = useConversation();
  const { mutate: fetchSuggestions } = useSuggestion();

  const scrollRef = useRef<ScrollView>(null);
  const suggestionDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const latestInputRef = useRef<string>("");

  const selectedCategoryFaqs = useMemo(
    () => categoryQuestionsData?.data?.questions ?? [],
    [categoryQuestionsData]
  );

  const greetingText = useMemo(() => getGreeting(), []);

  const { control, handleSubmit, reset, watch } = useForm<ChatFormValues>({
    defaultValues: { message: "" },
    resolver: zodResolver(chatSchema),
  });

  const scrollToBottom = useRef(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }).current;

  useEffect(() => {
    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 150);
    return () => clearTimeout(timer);
  }, [messages.length, isTyping, scrollToBottom]);

  useEffect(
    () => () => {
      if (suggestionDebounceRef.current) {
        clearTimeout(suggestionDebounceRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (!currentInput.trim()) {
      setDynamicSuggestions([]);
      setIsFetchingSuggestions(false);
      if (suggestionDebounceRef.current) {
        clearTimeout(suggestionDebounceRef.current);
      }
      return;
    }

    latestInputRef.current = currentInput;
    setIsFetchingSuggestions(true);

    if (suggestionDebounceRef.current) {
      clearTimeout(suggestionDebounceRef.current);
    }

    suggestionDebounceRef.current = setTimeout(() => {
      const captured = currentInput;

      fetchSuggestions(
        { language: "en", message: captured },
        {
          onError: () => {
            if (latestInputRef.current !== captured) {
              return;
            }
            setDynamicSuggestions([]);
            setIsFetchingSuggestions(false);
          },
          onSuccess: (response) => {
            if (latestInputRef.current !== captured) {
              return;
            }
            const suggestions = (response?.data?.suggestions ?? [])
              .map((s: { question?: string }) => s.question)
              .filter(Boolean)
              .slice(0, MAX_SUGGESTIONS);
            setDynamicSuggestions(suggestions);
            setIsFetchingSuggestions(false);
          },
        }
      );
    }, 400);
  }, [currentInput, fetchSuggestions]);

  const clearSuggestions = () => {
    setDynamicSuggestions([]);
    setCurrentInput("");
    if (suggestionDebounceRef.current) {
      clearTimeout(suggestionDebounceRef.current);
    }
  };

  const handleInputChange = (text: string) => {
    setCurrentInput(text);
  };

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) {
      return;
    }

    reset({ message: "" });
    clearSuggestions();

    const userMsg: Message = {
      id: `${Date.now()}-u`,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    askChabi(
      { language: "en", message: trimmed },
      {
        onError: () => {
          const errorMsg: Message = {
            id: `${Date.now()}-err`,
            role: "ai",
            text: "Something went wrong. Please try again.",
          };
          setMessages((prev) => [...prev, errorMsg]);
        },
        onSettled: () => setIsTyping(false),
        onSuccess: (response) => {
          const aiMsg: Message = {
            id: `${Date.now()}-a`,
            rich: response?.data?.rich ?? false,
            role: "ai",
            text: response?.data?.answer || "I couldn't process that.",
          };
          setMessages((prev) => [...prev, aiMsg]);
        },
      }
    );
  };

  const hasMessages = messages.length > 0;

  return (
    <Profile.Container scrollable={false}>
      <KeyboardAwareScrollView
        bottomOffset={16}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        keyboardShouldPersistTaps="handled"
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
      >
        {!hasMessages && (
          <View className="mb-6 flex-1 items-center justify-center px-2">
            <GlowingLogo />
            <Animated2.Text
              className="mt-2 text-center font-extrabold text-3xl text-foreground tracking-tight"
              entering={FadeInDown.delay(100).duration(400)}
            >
              {greetingText}, Agent
            </Animated2.Text>
            <Animated2.Text
              className="mt-3 max-w-72 text-center font-medium text-[15px] text-foreground/60 leading-6"
              entering={FadeInDown.delay(200).duration(400)}
            >
              Unlock quick wealth insights, check commissions, and manage your
              mutual funds seamlessly.
            </Animated2.Text>

            <Animated2.View
              className="mt-8 w-full"
              entering={FadeInUp.delay(250).duration(400)}
            >
              <Text className="mb-3.5 ml-1 font-extrabold text-[11px] text-foreground/45 uppercase tracking-widest">
                Browse by Category
              </Text>
              <View className="flex-row flex-wrap gap-2.5">
                {[...(categoriesData?.data?.categories ?? [])]
                  .sort((a, b) => a.length - b.length)
                  .slice(
                    0,
                    showAllCategories ? undefined : VISIBLE_CATEGORIES_COUNT
                  )
                  .map((category: string, index: number) => {
                    const active = selectedCategory === category;
                    return (
                      <Animated2.View
                        entering={FadeInUp.delay(300 + index * 50).duration(
                          250
                        )}
                        key={category}
                      >
                        <TouchableOpacity
                          activeOpacity={0.8}
                          className={`flex-row items-center gap-2 rounded-full border px-4 py-2.5 transition-all ${active ? "border-success bg-success/15 shadow-sm shadow-success/10" : "border-border/30 bg-surface-secondary/40"}`}
                          onPress={() =>
                            setSelectedCategory((prev) =>
                              prev === category ? null : category
                            )
                          }
                        >
                          <View className="mr-0.5">
                            {getCategoryIcon(category)}
                          </View>
                          <Text
                            className={`font-semibold text-xs ${active ? "text-success" : "text-foreground"}`}
                            numberOfLines={1}
                          >
                            {category}
                          </Text>
                        </TouchableOpacity>
                      </Animated2.View>
                    );
                  })}
                {categoriesData?.data?.categories?.length >
                  VISIBLE_CATEGORIES_COUNT && (
                  <Animated2.View
                    entering={FadeInUp.delay(
                      300 +
                        (showAllCategories ? VISIBLE_CATEGORIES_COUNT : 0) * 50
                    ).duration(250)}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      className="rounded-full border border-border/30 border-dashed bg-surface/25 px-4 py-2.5"
                      onPress={() => setShowAllCategories(!showAllCategories)}
                    >
                      <Text className="font-semibold text-foreground/70 text-xs">
                        {showAllCategories
                          ? "Show Less"
                          : `+${categoriesData?.data?.categories?.length - VISIBLE_CATEGORIES_COUNT} More`}
                      </Text>
                    </TouchableOpacity>
                  </Animated2.View>
                )}
              </View>
            </Animated2.View>

            {selectedCategory && selectedCategoryFaqs.length > 0 && (
              <Animated2.View
                className="mt-6 w-full"
                entering={FadeInDown.duration(300)}
              >
                <Text className="mb-3.5 ml-1 font-extrabold text-[11px] text-foreground/45 uppercase tracking-widest">
                  Popular Questions
                </Text>
                <View className="gap-2.5">
                  {selectedCategoryFaqs
                    .slice(0, MAX_SUGGESTIONS)
                    .map(
                      (
                        item: { id: string; question: string },
                        index: number
                      ) => (
                        <SuggestionCard
                          index={index}
                          key={item.id}
                          onPress={() => handleSend(item.question)}
                          text={item.question}
                        />
                      )
                    )}
                </View>
              </Animated2.View>
            )}

            {!selectedCategory && (
              <View className="mt-7 w-full">
                <Text className="mb-3.5 ml-1 font-extrabold text-[11px] text-foreground/45 uppercase tracking-widest">
                  Quick Questions
                </Text>
                <View className="flex-row flex-wrap justify-between gap-3">
                  {BASE_SUGGESTIONS.slice(0, MAX_SUGGESTIONS).map(
                    (item, index) => (
                      <Animated2.View
                        entering={FadeInUp.delay(300 + index * 60)
                          .duration(300)
                          .springify()
                          .damping(12)}
                        key={item.text}
                        style={{ width: "48%" }}
                      >
                        <TouchableOpacity
                          activeOpacity={0.75}
                          className="h-28 justify-between rounded-2xl border border-border/20 border-continuous bg-surface-secondary/40 p-4 shadow-sm active:border-accent/50 active:bg-surface-secondary/60"
                          onPress={() => handleSend(item.text)}
                        >
                          <View className="flex-row items-center justify-between">
                            <View className="h-7 w-7 items-center justify-center rounded-lg border border-border/15 bg-surface-tertiary">
                              {renderSuggestionIcon(item.iconType)}
                            </View>
                            <View
                              className={`rounded-full border px-2 py-0.5 ${item.color === "success" ? "border-success/35 bg-success/15" : item.color === "warning" ? "border-warning/35 bg-warning/15" : "border-accent/35 bg-accent/15"}`}
                            >
                              <Text
                                className={`font-extrabold text-[8px] uppercase tracking-wider ${item.color === "success" ? "text-success" : item.color === "warning" ? "text-warning" : "text-accent"}`}
                              >
                                {item.tag}
                              </Text>
                            </View>
                          </View>
                          <Text
                            className="mt-2 font-bold text-[13px] text-foreground leading-4.5"
                            numberOfLines={2}
                          >
                            {item.text}
                          </Text>
                        </TouchableOpacity>
                      </Animated2.View>
                    )
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {messages.map((m) => (
          <Animated2.View
            className="mb-5"
            entering={FadeInDown.duration(300).springify()}
            key={m.id}
          >
            {m.role === "ai" ? (
              <View className="flex-row items-start gap-3">
                <View className="h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/30 bg-surface shadow-sm">
                  <Image
                    className="h-6.5 w-6.5"
                    resizeMode="contain"
                    source={require("@/assets/images/chabi-ai.png")}
                  />
                </View>
                <View className="max-w-[82%] flex-1">
                  <View className="mb-1.5 flex-row items-center gap-1.5">
                    <Text className="font-extrabold text-[11px] text-foreground/45 uppercase tracking-wider">
                      Chabi AI
                    </Text>
                    <View className="rounded border border-accent/20 bg-accent/15 px-1.5 py-0.5">
                      <Text className="font-bold text-[8px] text-accent uppercase">
                        Wealth Smart
                      </Text>
                    </View>
                  </View>
                  <View className="rounded-2xl rounded-tl-sm border-border/20 border-y border-r border-l-4 border-l-accent bg-surface-secondary/35 p-4 shadow-md">
                    <Text className="font-medium text-[14px] text-foreground leading-6">
                      {renderFormattedText(m.text)}
                    </Text>
                    {m.rich && (
                      <View className="mt-4 flex-row gap-2.5">
                        <RichStat
                          label="Projected"
                          type="projected"
                          value="₹10.8L"
                        />
                        <RichStat
                          label="Invested"
                          type="invested"
                          value="₹6.0L"
                        />
                        <RichStat
                          highlight
                          label="Returns"
                          type="returns"
                          value="+₹4.8L"
                        />
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ) : (
              <View className="w-full items-end">
                <View className="max-w-[82%] rounded-2xl rounded-tr-sm border border-accent/25 bg-accent/10 px-4.5 py-3.5 shadow-accent/5 shadow-sm">
                  <Text className="font-semibold text-[14px] text-foreground leading-5.5">
                    {m.text}
                  </Text>
                </View>
              </View>
            )}
          </Animated2.View>
        ))}

        {isTyping && <TypingIndicator />}
      </KeyboardAwareScrollView>

      <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
        <AiSuggestionDropdown
          isFetching={isFetchingSuggestions}
          onSuggestionPress={handleSend}
          suggestions={dynamicSuggestions}
        />
        <ChatInputBar
          control={control}
          disabled={isTyping}
          handleSubmit={handleSubmit}
          onInputChange={handleInputChange}
          onSend={handleSend}
          watch={watch}
        />
      </KeyboardStickyView>
    </Profile.Container>
  );
}
