import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function Footer() {
    const { bottom } = useSafeAreaInsets()
    return (
        <View
            className="flex bg-gray-100 shrink-0 native:hidden"
            style={{ paddingBottom: bottom }}
        >
            <View className="items-start flex-1 px-4 py-6 md:px-6 ">
                <Text className={'text-center text-gray-700'}>
                    © {new Date().getFullYear()} Me
                </Text>
            </View>
        </View>
    )
}

export default Footer
