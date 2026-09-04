import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { Colors, Spacing, Radius, Shadows } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

const QUICK_PROMPTS = [
  '⚡ Buy 5 for 1399 Tk bundle',
  '👕 How do sizes fit?',
  '🕌 Best Panjabi for Jummah',
  '📍 Showrooms in Dhaka & Sylhet',
  '🚚 Delivery fees & time',
  '🌿 Alcohol-free Attar perfumes',
];

export default function AIAssistantScreen() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'Assalamu Alaikum! I am your One Ummah BD AI Assistant. How can I help you discover modest attire, find your size, locate a showroom, or learn about our special offers today?',
      time: 'Just now',
    },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let botReply = '';
      const q = text.toLowerCase();

      if (q.includes('1399') || q.includes('buy 5') || q.includes('bundle') || q.includes('deal')) {
        botReply =
          'Our famous "Buy 5 Economy T-Shirts for 1399 Tk" promotion gives you 5 premium cotton Dawah graphic tees of your choice at just ৳279 each! Simply add 5 economy tees to your cart, and the special bundle pricing will automatically apply at checkout.';
      } else if (q.includes('size') || q.includes('measurement') || q.includes('fit') || q.includes('chart')) {
        botReply =
          'Our regular editions run true to Bangladeshi sizing (M: 38-40", L: 40-42", XL: 42-44", XXL: 44-46"). For Drop Shoulder oversized streetwear tees, your regular size gives an intentionally relaxed, contemporary silhouette.';
      } else if (q.includes('panjabi') || q.includes('jummah') || q.includes('eid') || q.includes('thobe')) {
        botReply =
          'For Friday prayer and Eid festivals, our Classic Jummah Panjabi in White or Navy and Arabian Special Thobes are customer favorites! Crafted from 100% breathable combed cotton with elegant collar craftsmanship.';
      } else if (q.includes('showroom') || q.includes('outlet') || q.includes('shop') || q.includes('location') || q.includes('dhaka') || q.includes('sylhet')) {
        botReply =
          'We have 15+ physical showrooms across Bangladesh! In Dhaka: Bashundhara City (Level 5), Uttara (Sector 7), and Mirpur 01. In Sylhet: Zindabazar, Kumarpara, and Dorga Gate. Check the Showroom Locator screen for manager phone numbers and map directions!';
      } else if (q.includes('delivery') || q.includes('charge') || q.includes('fee') || q.includes('shipping')) {
        botReply =
          'Delivery charges are ৳70 inside Dhaka (1-2 business days) and ৳130 outside Dhaka (3-4 business days). Orders over ৳3,000 receive 100% FREE Delivery nationwide! Both Cash on Delivery and bKash are accepted.';
      } else if (q.includes('attar') || q.includes('perfume') || q.includes('oil') || q.includes('scent')) {
        botReply =
          'All OUBD Attar perfume oils are 100% alcohol-free, concentrated, and formulated for 8-12+ hours of lasting fragrance. Top picks include Arabian White Musk, Royal Oudh, and Silver Water.';
      } else {
        botReply =
          'JazakAllah Khair for reaching out! You can browse our complete collection across Categories, or chat directly with our customer support team on WhatsApp at +880 1901-165090.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 700);
  };

  return (
    <View style={styles.container}>
      <Header title="AI Shopping Assistant" showBack={false} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Assistant Header Banner with Human Escalation */}
        <View style={styles.assistantStatusBanner}>
          <View style={styles.avatarGlow}>
            <Ionicons name="sparkles" size={16} color={Colors.textInverse} />
          </View>
          <View style={styles.statusCol}>
            <View style={styles.nameBadgeRow}>
              <Text style={styles.assistantTitle}>Ummah AI</Text>
              <View style={styles.activeDot} />
              <Text style={styles.activeLabel}>Live Online</Text>
            </View>
            <Text style={styles.assistantSub}>Trained on One Ummah BD catalog & sizing</Text>
          </View>

          {/* Quick Actions: Human WhatsApp Escalation & Clear History */}
          <View style={styles.bannerActions}>
            <TouchableOpacity
              style={styles.humanBtn}
              onPress={() => Linking.openURL(APP_CONFIG.SUPPORT_WHATSAPP)}
              activeOpacity={0.85}
              accessibilityLabel="Chat with Human Support on WhatsApp"
            >
              <Ionicons name="logo-whatsapp" size={15} color={Colors.textInverse} />
              <Text style={styles.humanBtnText}>Human</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setMessages([
                  {
                    id: `m-${Date.now()}`,
                    sender: 'bot',
                    text: 'Chat history cleared. Assalamu Alaikum! How can I assist you with your modest wear shopping today?',
                    time: 'Just now',
                  },
                ]);
              }}
              activeOpacity={0.75}
              accessibilityLabel="Reset conversation"
            >
              <Ionicons name="refresh-outline" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat Messages */}
        <Animated.View style={[styles.chatContainer, { opacity: fadeAnim }]}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatScroll}
            contentContainerStyle={styles.chatScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.msgRow,
                  m.sender === 'user' ? styles.userMsgRow : styles.botMsgRow,
                ]}
              >
                {m.sender === 'bot' && (
                  <View style={styles.botIcon}>
                    <Ionicons name="sparkles" size={12} color={Colors.accent} />
                  </View>
                )}

                <View
                  style={[
                    styles.bubble,
                    m.sender === 'user' ? styles.userBubble : styles.botBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.msgText,
                      m.sender === 'user' ? styles.userText : styles.botText,
                    ]}
                  >
                    {m.text}
                  </Text>
                  <Text
                    style={[
                      styles.timeText,
                      m.sender === 'user' ? styles.userTime : styles.botTime,
                    ]}
                  >
                    {m.time}
                  </Text>
                </View>
              </View>
            ))}

            {isTyping && (
              <View style={[styles.msgRow, styles.botMsgRow]}>
                <View style={styles.botIcon}>
                  <Ionicons name="sparkles" size={12} color={Colors.accent} />
                </View>
                <View style={[styles.bubble, styles.botBubble, styles.typingBubble]}>
                  <Text style={styles.typingText}>Thinking...</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </Animated.View>

        {/* Quick Suggestion Chips */}
        <View style={styles.promptsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsScroll}>
            {QUICK_PROMPTS.map((p, i) => (
              <TouchableOpacity
                key={i}
                style={styles.promptChip}
                onPress={() => handleSend(p)}
                activeOpacity={0.8}
              >
                <Text style={styles.promptText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.inputField}
            placeholder="Ask about sizing, combos, Eid outfits..."
            placeholderTextColor={Colors.textMuted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!input.trim()}
            activeOpacity={0.85}
          >
            <Ionicons name="send" size={16} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  assistantStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  avatarGlow: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  statusCol: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  assistantTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  activeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
  },
  assistantSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  bannerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  humanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366', // WhatsApp Green
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    gap: 4,
    ...Shadows.sm,
  },
  humanBtnText: {
    color: Colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
  },
  resetBtn: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  chatScroll: {
    flex: 1,
  },
  chatScrollContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  userMsgRow: {
    justifyContent: 'flex-end',
  },
  botMsgRow: {
    justifyContent: 'flex-start',
  },
  botIcon: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  botBubble: {
    backgroundColor: Colors.surfaceVariant,
    borderBottomLeftRadius: 3,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 3,
  },
  typingBubble: {
    paddingVertical: 10,
  },
  typingText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  msgText: {
    fontSize: 13,
    lineHeight: 19,
  },
  botText: {
    color: Colors.textPrimary,
  },
  userText: {
    color: Colors.textInverse,
  },
  timeText: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  botTime: {
    color: Colors.textMuted,
  },
  userTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  promptsSection: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  promptsScroll: {
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  promptChip: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  promptText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
    gap: Spacing.sm,
  },
  inputField: {
    flex: 1,
    height: 42,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    fontSize: 13,
    color: Colors.primary,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.borderStrong,
  },
});
