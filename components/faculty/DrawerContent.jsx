import React from 'react';
import { Alert, Text, View, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router } from 'expo-router';

export default function CustomDrawerContent(props) {
    
    const MenuCategory = ({ title }) => (
        <View style={styles.menuCategory}>
            <Text style={styles.menuCategoryText}>{title}</Text>
        </View>
    );
        
    const { activeScreen, setActiveScreen } = props;
    
    const CustomDrawerItem = ({ icon, label, onPress, isActive = false }) => {
        return (
            <TouchableOpacity 
                style={[styles.customDrawerItem, isActive && styles.customDrawerItemActive]} 
                onPress={onPress}
            >
                <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                    <MaterialCommunityIcons 
                        name={icon} 
                        size={22} 
                        color={isActive ? '#fff' : '#bbb'} 
                    />
                </View>
                <Text style={[styles.drawerItemLabel, isActive && styles.drawerItemLabelActive]}>
                    {label}
                </Text>
                {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
        );
    };

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    props.signOut();
                    console.log('User logged out');
                    props.navigation.replace('sign-in');
                },
            },
        ]);
    };

    const navigateTo = (routeName, screenName) => {
        setActiveScreen(screenName);
        router.push(routeName);
        props.navigation.closeDrawer();
    };

    return (
        <View style={styles.drawerMainContainer}>
            {/* Top Banner */}
            <LinearGradient
                colors={['#05033d', '#1a1a1a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.drawerBanner}
            >
                <View style={styles.appBranding}>
                    <MaterialCommunityIcons name="school" size={32} color="#fff" />
                    <Text style={styles.appName}>UniConnect</Text>
                </View>
                <Text style={styles.appTagline}>Your Campus Companion</Text>
            </LinearGradient>

            {/* Menu Items */}
            <DrawerContentScrollView 
                {...props} 
                contentContainerStyle={styles.drawerContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Main Navigation */}
                <CustomDrawerItem 
                    icon="home-variant" 
                    label="Home" 
                    onPress={() => navigateTo('/(tabs)', 'home')}
                    isActive={activeScreen === 'home'}
                />
                
                <CustomDrawerItem 
                    icon="bell-ring-outline" 
                    label="Notifications" 
                    onPress={() => navigateTo('/(root)/(tabs)/(dashboard)/notice', 'notifications')}
                    isActive={activeScreen === 'notifications'}
                />

                {/* Academic Section */}
                <MenuCategory title="ACADEMICS" />
                
                <CustomDrawerItem 
                    icon="calendar-check" 
                    label="Attendance" 
                    onPress={() => navigateTo('/(root)/(tabs)/(dashboard)', 'attendance')}
                    isActive={activeScreen === 'attendance'}
                />
                
                <CustomDrawerItem 
                    icon="clipboard-text-outline" 
                    label="Assignments" 
                    onPress={() => navigateTo('/(root)/(tabs)/(dashboard)/assignments', 'assignments')}
                    isActive={activeScreen === 'assignments'}
                />
                
                <CustomDrawerItem 
                    icon="book-open-variant" 
                    label="Courses" 
                    onPress={() => navigateTo('/(root)/(tabs)/(dashboard)/courses', 'courses')}
                    isActive={activeScreen === 'courses'}
                />

                {/* Profile */}
                <CustomDrawerItem 
                    icon="account-circle" 
                    label="Profile" 
                    onPress={() => navigateTo('/(root)/Profile', 'profile')}
                    isActive={activeScreen === 'profile'}
                />

                {/* Settings */}
                <MenuCategory title="SETTINGS" />
                
                <CustomDrawerItem 
                    icon="cog-outline" 
                    label="Settings" 
                    onPress={() => navigateTo('/(root)/(tabs)/(dashboard)/settings', 'settings')}
                    isActive={activeScreen === 'settings'}
                />
                
                <CustomDrawerItem 
                    icon="help-circle-outline" 
                    label="Help & Support" 
                    onPress={() => navigateTo('/(root)/(tabs)/(dashboard)/help', 'help')}
                    isActive={activeScreen === 'help'}
                />
            </DrawerContentScrollView>

            {/* Bottom Section with Logout */}
            <View style={styles.bottomSection}>
                <Divider style={styles.divider} />
                
                <TouchableOpacity 
                    onPress={handleLogout} 
                    style={styles.logoutButton}
                >
                    <LinearGradient
                        colors={['#FF416C', '#FF4B2B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.logoutGradient}
                    >
                        <MaterialCommunityIcons name="logout-variant" size={22} color="#fff" />
                        <Text style={styles.logoutText}>Sign Out</Text>
                    </LinearGradient>
                </TouchableOpacity>
                
                <Text style={styles.versionText}>UniConnect v1.0.0</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerMainContainer: {
        flex: 1,
        backgroundColor: '#1a1a1a', // Updated background color
    },
    drawerBanner: {
        paddingTop: 50,
        paddingBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    appBranding: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    appName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginLeft: 10,
    },
    appTagline: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        letterSpacing: 0.5,
    },
    drawerContent: {
        paddingTop: 5,
        paddingHorizontal: 16,
    },
    bottomSection: {
        padding: 16,
        paddingBottom: 24,
    },
    divider: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        height: 1,
        marginBottom: 16,
    },
    logoutButton: {
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    logoutGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
    versionText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
        textAlign: 'center',
    },
    customDrawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginVertical: 2,
        position: 'relative',
    },
    customDrawerItemActive: {
        backgroundColor: 'rgba(13, 1, 237, 0.15)',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginRight: 12,
    },
    iconContainerActive: {
        backgroundColor: '#1307e0',
    },
    activeIndicator: {
        width: 4,
        height: '70%',
        backgroundColor: '#1307e0',
        borderRadius: 2,
        position: 'absolute',
        right: 0,
    },
    menuCategory: {
        marginTop: 20,
        marginBottom: 5,
        paddingHorizontal: 10,
    },
    menuCategoryText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    drawerItemLabel: {
        color: '#fff',
        fontSize: 16,
    },
    drawerItemLabelActive: {
        color: '#6C63FF',
    },
});