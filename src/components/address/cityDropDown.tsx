import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { FieldError } from "heroui-native/field-error";
import { Select } from "heroui-native/select";
import { useState } from "react";
import type { FieldValues, UseControllerProps } from "react-hook-form";
import { Controller } from "react-hook-form";
import { View } from "react-native";
import { baseApi } from "@/services/apis";

interface CityDropdownProps<T extends FieldValues>
  extends UseControllerProps<T> {
  stateId: string;
}

interface SelectOption {
  label?: string;
  value?: string;
}

export const CityDropdown = <T extends FieldValues>({
  stateId,
  ...props
}: CityDropdownProps<T>) => {
  const [selectedCity, setSelectedCity] = useState<SelectOption>();

  const { data, error, isLoading } = useQuery({
    enabled: !!stateId,
    queryFn: async () => {
      const response = await baseApi("/address/cities", {
        query: { count: 50, state: stateId },
      });
      console.log(response.data);
      if (response.error) {
        throw new Error(response.error.message ?? "", {
          cause: response.error.statusText,
        });
      }

      return response.data;
    },
    queryKey: ["cities", stateId],
  });

  return (
    <Controller
      control={props.control}
      defaultValue={props.defaultValue}
      name={props.name}
      render={({ field }) => {
        const handleChange = (value: { label: string; value: string }) => {
          const option = {
            label: value?.label,
            value: value?.value,
          };

          setSelectedCity(option);
          field.onChange(option.value);
        };

        return (
          <View className="gap-y-2">
            <Select
              isDisabled={isLoading || !!error || field.disabled || !stateId}
              // @ts-expect-error
              onValueChange={handleChange}
              presentation="bottom-sheet"
              // @ts-expect-error
              value={selectedCity}
            >
              <Select.Trigger>
                <Select.Value
                  placeholder={stateId ? "Select City" : "Select State first"}
                />
                <Select.TriggerIndicator />
              </Select.Trigger>

              <Select.Portal>
                <Select.Overlay />

                <Select.Content
                  backgroundClassName="bg-surface shadow-none"
                  contentContainerClassName="h-full pt-1 pb-1 mx-2.5 rounded-t-4xl border border-separator/20 bg-surface overflow-hidden"
                  contentContainerProps={{
                    style: {
                      borderCurve: "continuous",
                    },
                  }}
                  enableDynamicSizing={false}
                  enableOverDrag={false}
                  handleClassName="h-1"
                  handleIndicatorClassName="w-12 h-[3px]"
                  presentation="bottom-sheet"
                  snapPoints={["35%", "50%"]}
                >
                  <BottomSheetScrollView
                    contentContainerClassName="p-4"
                    showsVerticalScrollIndicator={false}
                  >
                    {
                      // @ts-expect-error
                      data?.data?.map((city, index: number) => (
                        <Select.Item
                          key={`${city.id}-${
                            // biome-ignore lint/suspicious/noArrayIndexKey: will fix
                            index
                          }`}
                          label={city.name}
                          value={city.name}
                        />
                      ))
                    }
                  </BottomSheetScrollView>
                </Select.Content>
              </Select.Portal>
            </Select>

            <FieldError isInvalid={!!error}>{error?.message}</FieldError>
          </View>
        );
      }}
      rules={props.rules}
    />
  );
};
