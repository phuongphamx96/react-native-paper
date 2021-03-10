import * as React from 'react';
import {
  BackgroundPropType,
  StyleProp,
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import color from 'color';
import { withTheme } from '../../core/theming';

const ANDROID_VERSION_MARSHMALLOW = 23;

type Props = React.ComponentProps<typeof TouchableWithoutFeedback> & {
  borderless?: boolean;
  background?: BackgroundPropType;
  disabled?: boolean;
  onPress?: () => void | null;
  rippleColor?: string;
  underlayColor?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  theme: ReactNativePaper.Theme;
};

const TouchableRipple = ({
  style,
  background,
  borderless = false,
  disabled: disabledProp,
  rippleColor,
  underlayColor,
  children,
  theme,
  ...rest
}: Props) => {
  const { dark, colors } = theme;
  const disabled = disabledProp || !rest.onPress;
  const calculatedRippleColor =
    rippleColor ||
    color(colors.text)
      .alpha(dark ? 0.32 : 0.2)
      .rgb()
      .string();

  if (TouchableRipple.supported) {
    return (
      <TouchableNativeFeedback
        {...rest}
        disabled={disabled}
        useForeground={borderless}
        background={
          background != null
            ? background
            : TouchableNativeFeedback.Ripple(calculatedRippleColor, borderless)
        }
      >
        <View style={[borderless && styles.overflowHidden, style]}>
          {React.Children.only(children)}
        </View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableHighlight
      {...rest}
      disabled={disabled}
      style={[borderless && styles.overflowHidden, style]}
      underlayColor={
        underlayColor != null
          ? underlayColor
          : color(calculatedRippleColor).fade(0.5).rgb().string()
      }
    >
      {React.Children.only(children)}
    </TouchableHighlight>
  );
};

TouchableRipple.supported =
  Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_MARSHMALLOW;

const styles = StyleSheet.create({
  overflowHidden: {
    overflow: 'hidden',
  },
});

export default withTheme(TouchableRipple);
