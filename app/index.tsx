import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { images } from "@/constants/images";

type ColorSwatch = {
  name: string;
  hex: string;
  className: string;
};

type TypeSpec = {
  name: string;
  usage: string;
  size: string;
  weight: string;
  lineHeight: string;
  className: string;
};

const primaryColors: ColorSwatch[] = [
  {
    name: "Lingua Purple",
    hex: "#6C4EF5",
    className: "bg-lingua-purple",
  },
  {
    name: "Lingua Deep Purple",
    hex: "#5B3BF6",
    className: "bg-lingua-deep-purple",
  },
  {
    name: "Lingua Blue",
    hex: "#4D8BFF",
    className: "bg-lingua-blue",
  },
  {
    name: "Lingua Green",
    hex: "#21C16B",
    className: "bg-lingua-green",
  },
];

const semanticColors: ColorSwatch[] = [
  { name: "Success", hex: "#21C16B", className: "bg-success" },
  { name: "Warning", hex: "#FFC800", className: "bg-warning" },
  { name: "Streak", hex: "#FF8A00", className: "bg-streak" },
  { name: "Error", hex: "#FF4D4F", className: "bg-error" },
  { name: "Info", hex: "#4D8BFF", className: "bg-info" },
];

const neutralColors: ColorSwatch[] = [
  { name: "Text / Primary", hex: "#0D132B", className: "bg-text-primary" },
  { name: "Text / Secondary", hex: "#6B7280", className: "bg-text-secondary" },
  { name: "Border", hex: "#E5E7EB", className: "bg-border" },
  { name: "Surface", hex: "#F6F7FB", className: "bg-surface" },
  { name: "Background", hex: "#FFFFFF", className: "bg-background border border-border" },
];

const typographyRows: TypeSpec[] = [
  {
    name: "H1",
    usage: "Page / Screen Title",
    size: "32px",
    weight: "Bold",
    lineHeight: "1.2",
    className: "ds-text--h1",
  },
  {
    name: "H2",
    usage: "Section Title",
    size: "24px",
    weight: "SemiBold",
    lineHeight: "1.3",
    className: "ds-text--h2",
  },
  {
    name: "H3",
    usage: "Card / Module Title",
    size: "20px",
    weight: "SemiBold",
    lineHeight: "1.3",
    className: "ds-text--h3",
  },
  {
    name: "H4",
    usage: "Subheading",
    size: "16px",
    weight: "Medium",
    lineHeight: "1.4",
    className: "ds-text--h4",
  },
  {
    name: "Body Large",
    usage: "Important content",
    size: "16px",
    weight: "Regular",
    lineHeight: "1.6",
    className: "ds-text--body-lg text-text-primary",
  },
  {
    name: "Body Medium",
    usage: "Body text",
    size: "14px",
    weight: "Regular",
    lineHeight: "1.6",
    className: "ds-text--body-md text-text-primary",
  },
  {
    name: "Body Small",
    usage: "Supporting text",
    size: "13px",
    weight: "Regular",
    lineHeight: "1.6",
    className: "ds-text--body-sm text-text-primary",
  },
  {
    name: "Caption",
    usage: "Labels, meta text",
    size: "11px",
    weight: "Regular",
    lineHeight: "1.4",
    className: "ds-text--caption text-text-secondary",
  },
];

function SectionHeader({ title }: { title: string }) {
  return (
    <View className="gap-2">
      <Text className="ds-section__heading">{title}</Text>
      <View className="ds-divider" />
    </View>
  );
}

function ColorGroup({
  title,
  swatches,
}: {
  title: string;
  swatches: ColorSwatch[];
}) {
  return (
    <View className="gap-4">
      <Text className="ds-section__eyebrow">{title}</Text>
      <View className="flex-row flex-wrap gap-x-8 gap-y-7">
        {swatches.map((swatch) => (
          <View className="w-28 gap-2" key={swatch.name}>
            <View className={`h-20 w-20 rounded-swatch ${swatch.className}`} />
            <View>
              <Text className="ds-text--caption font-poppins-semibold uppercase text-text-secondary">
                {swatch.name}
              </Text>
              <Text className="ds-text--body-sm text-text-secondary">
                {swatch.hex}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function TypographyRow({ item }: { item: TypeSpec }) {
  return (
    <View className="min-h-16 gap-2 rounded-control bg-surface p-3 md:flex-row md:items-center md:gap-4 md:bg-transparent md:p-0">
      <Text className={`md:w-36 ${item.className}`}>{item.name}</Text>
      <Text className="ds-text--body-md text-text-secondary md:flex-1">
        {item.usage}
      </Text>
      <Text className="ds-text--body-md text-text-secondary md:w-16">
        {item.size}
      </Text>
      <Text className="ds-text--body-md text-text-secondary md:w-24">
        {item.weight}
      </Text>
      <Text className="ds-text--body-md text-text-secondary md:w-12">
        {item.lineHeight}
      </Text>
    </View>
  );
}

export default function Index() {
  return (
    <ScrollView
      className="flex-1 ds-screen"
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-4 xl:flex-row">
        <View className="flex-1 gap-4">
          <View className="ds-card gap-7 p-6">
            <SectionHeader title="Brand" />
            <View className="flex-row flex-wrap items-center justify-center gap-6 py-4">
              <Image
                source={images.mascotLogo}
                className="h-24 w-24"
                resizeMode="contain"
              />
              <Text className="font-poppins-bold text-5xl text-text-primary sm:text-6xl">
                lingua
              </Text>
            </View>
          </View>

          <View className="ds-card gap-8 p-6">
            <SectionHeader title="Colors" />
            <ColorGroup title="Primary" swatches={primaryColors} />
            <ColorGroup title="Semantic" swatches={semanticColors} />
            <ColorGroup title="Neutrals" swatches={neutralColors} />
          </View>
        </View>

        <View className="ds-card flex-1 gap-6 p-6">
          <SectionHeader title="Typography" />
          <View className="gap-3">
            <Text className="ds-section__eyebrow">Font Family</Text>
            <Text className="font-poppins-bold text-5xl text-text-primary sm:text-6xl">
              Poppins
            </Text>
            <Text className="ds-text--body-lg max-w-[540px] text-text-secondary">
              Poppins is a modern, geometric sans-serif typeface that provides
              excellent readability and a friendly personality.
            </Text>
          </View>

          <View className="gap-4">
            {typographyRows.map((item) => (
              <TypographyRow item={item} key={item.name} />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
});
