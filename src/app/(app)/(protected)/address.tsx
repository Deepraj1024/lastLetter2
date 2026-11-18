import { router } from "expo-router";
import { Button } from "heroui-native/button";
import { Input } from "heroui-native/input";
import { useToast } from "heroui-native/toast";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Text, View } from "react-native";
import { CityDropdown } from "@/components/address/cityDropDown";
import { StateDropdown } from "@/components/address/stateDropDown";
import { Profile } from "@/components/profile";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";

export default function EditAddress() {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      address: "",
      city: "",
      pincode: "",
      state: "",
    },
  });

  const { data } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { toast } = useToast();

  useEffect(() => {
    if (data?.agent) {
      reset({
        address: data.agent.address || "",
        city: data.agent.city || "",
        pincode: data.agent.pincode || "",
        state: data.agent.state || "",
      });
    }
  }, [data, reset]);

  const selectedState = useWatch({
    control,
    name: "state",
  });

  const onSubmit = (formData: {
    state: string;
    city: string;
    address: string;
    pincode: string;
  }) => {
    if (formData.pincode.length !== 6) {
      toast.show("Enter valid pincode");
      return;
    }

    const payload = {
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      state: formData.state,
    };

    console.log("FINAL PAYLOAD", payload);

    updateProfile(payload, {
      onError: (error) => {
        console.log("UPDATE ERROR", error);
        toast.show({
          label: error?.message || "Something went wrong",
          variant: "danger",
        });
      },
      onSuccess: () => {
        toast.show({
          description: "Your address has been updated successfully",
          label: "Address updated successfully",
          variant: "success",
        });
        if (router.canGoBack()) {
          router.back();
        }
      },
    });
  };
  return (
    <Profile.Container title="Edit Address">
      <View className="mt-2 p-4">
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-foreground">State</Text>
          <StateDropdown
            control={control}
            name="state"
            rules={{ required: "State is required" }}
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-semibold text-foreground">City</Text>
          <CityDropdown
            control={control}
            name="city"
            rules={{ required: "City is required" }}
            stateId={selectedState}
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-semibold text-foreground">Pincode</Text>

          <Controller
            control={control}
            name="pincode"
            render={({ field }) => (
              <Input
                keyboardType="number-pad"
                onChangeText={field.onChange}
                placeholder="Enter pincode"
                value={field.value}
              />
            )}
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-semibold text-foreground">Address</Text>

          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <Input
                multiline
                numberOfLines={5}
                onChangeText={field.onChange}
                placeholder="Enter address"
                value={field.value}
              />
            )}
          />
        </View>

        <Button isDisabled={isPending} onPress={handleSubmit(onSubmit)}>
          <Button.Label>
            {isPending ? "Saving..." : "Save Address"}
          </Button.Label>
        </Button>
      </View>
    </Profile.Container>
  );
}
