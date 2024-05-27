import { Footer, Header } from '@/components'
import { Pressable, StatusBar, Text, View } from 'react-native'

import { useColorScheme } from 'nativewind'
import { useEffect } from 'react'

export default function Page() {
    const { colorScheme, toggleColorScheme } = useColorScheme()

    useEffect(() => {
        StatusBar.setBarStyle(
            colorScheme === 'dark' ? 'light-content' : 'dark-content',
            true
        )
    }, [colorScheme])

    return (
        <View className="flex-1 bg-white dark:bg-slate-800">
            <Header />
            <Content
                toggleColorScheme={toggleColorScheme}
                colorScheme={colorScheme}
            />
            <Footer />
        </View>
    )
}

function Content({ toggleColorScheme, colorScheme }) {
    return (
        <View className="justify-center flex-1">
            <View className="py-12 md:py-24 lg:py-32 xl:py-48">
                <View className="px-4 md:px-6">
                    <View className="flex flex-col items-center gap-4 text-center">
                        <Text
                            role="heading"
                            className="text-3xl font-bold tracking-tighter text-center native:text-5xl sm:text-4xl md:text-5xl lg:text-6xl dark:text-white"
                        >
                            Welcome to Project ACME
                        </Text>
                        <Text className="mx-auto max-w-[700px] text-lg text-center text-gray-500 md:text-xl dark:text-gray-400">
                            Discover and collaborate on acme. Explore our
                            services now.
                        </Text>

                        <Pressable
                            onPress={toggleColorScheme}
                            style={{
                                marginTop: 24,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                overflow: 'hidden',
                                backgroundColor:
                                    colorScheme === 'dark'
                                        ? '#FFFFFF'
                                        : '#1F2937',
                                borderRadius: 8,
                                height: 36,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        colorScheme === 'dark'
                                            ? '#000000'
                                            : '#FFFFFF',
                                    fontSize: 14,
                                    fontWeight: '500',
                                    transform: [{ scaleX: 0.8 }],
                                }}
                            >
                                {colorScheme === 'dark'
                                    ? 'Switch to Light Mode'
                                    : 'Switch to Dark Mode'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    )
}
