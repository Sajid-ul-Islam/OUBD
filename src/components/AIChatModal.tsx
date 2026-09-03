import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadows } from '../constants/theme';
import { useApp } from '../store/AppContext';
import { useRouter } from 'expo-router';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

const QUICK_PROMPTS = [
  '⚡ Buy 5 for 1399 Tk bundle',
  '👕 How do sizes run?',
  '🕌 Best Panjabi for Jummah',
  '📍 Showrooms near me',
  '🚚 Delivery fees & time',
];

export const AIChatModal: React.FC = () => {
  const { isAIChatOpen, closeAIChat } = useApp();
  const router = useRouter();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'Assalamu Alaikum! I am Ummah Bot, your AI shopping assistant at One Ummah BD. How can I assist you with our modest apparel, perfumes, or orders today?',
      time: 'Just now',
    },
  ]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isAIChatOpen) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [isAIChatOpen, messages]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate smart contextual AI response
    setTimeout(() => {
      let botReply = '';
      const q = text.toLowerCase();

      if (q.includes('1399') || q.includes('buy 5') || q.includes('bundle') || q.includes('deal')) {
        botReply =
          'Our famous "Buy 5 Economy T-Shirts for 1399 Tk" promotion gives you 5 premium cotton Dawah graphic tees of your choice at just ৳279 each! You can add 5 economy tees to your cart, and the special bundle pricing automatically computes at checkout.';
      } else if (q.includes('size') || q.includes('measurement') || q.includes('fit')) {
        botReply =
          'Our regular editions run true to Asian sizing (M: 38-40", L: 40-42", XL: 42-44", XXL: 44-46"). For Drop Shoulder oversized tees, ordering your standard size already provides an intentionally relaxed streetwear silhouette.';
      } else if (q.includes('panjabi') || q.includes('jummah') || q.includes('eid') || q.includes('thobe')) {
        botReply =
          'For Jummah and festive occasions, we recommend our Classic Jummah Panjabi in White or Navy, and our Arabian Special Thobe. They are crafted from 100% breathable combed cotton with subtle collar embroidery.';
      } else if (q.includes('showroom') || q.includes('outlet') || q.includes('shop') || q.includes('location')) {
        botReply =
          'We have over 15 physical showrooms across Bangladesh! In Dhaka, visit us at Bashundhara City (Level 5), Uttara (Sector 7), or Mirpur 01. We also have flagship stores in Sylhet, Chattogram, Khulna, Rajshahi, Bogura, and more. Check the Store Locator tab for direct phone numbers!';
      } else if (q.includes('delivery') || q.includes('charge') || q.includes('fee') || q.includes('shipping')) {
        botReply =
          'Delivery charges are ৳70 inside Dhaka (1-2 business days) and ৳130 outside Dhaka (3-4 business days). Orders over ৳3,000 qualify for FREE delivery nationwide! Cash on Delivery (COD) and bKash are fully supported.';
      } else if (q.includes('attar') || q.includes('perfume') || q.includes('scent')) {
        botReply =
          'All our Attar perfume oils are 100% non-alcoholic and long-lasting (8-12+ hours). Our bestsellers include Arabian White Musk, Royal Oudh, and Silver Water.';
      } else {
        botReply =
          'JazakAllah Khair for your message! You can browse our entire catalog via the Categories tab, or reach our live support team directly on WhatsApp at +880 1901-165090.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          time: 'Now',
        },
      ]);
    }, 600);
  };

  return (
    <Modal visible={isAIChatOpen} animationType="slide" transparent onRequestClose={closeAIChat}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <View style={styles.botAvatar}>
                <Ionicons name="sparkles" size={18} color={Colors.textInverse} />
              </View>
              <View>
                <View style={styles.titleRow}>
                  <Text style={styles.botName}>Ummah Bot</Text>
                  <View style={styles.onlineBadge}>
                    <View style={styles.greenDot} />
                    <Text style={styles.onlineText}>AI Online</Text>
                  </View>
                </View>
                <Text style={styles.botSub}>One Ummah BD Assistant</Text>
              </View>
            </View>

            <TouchableOpacity onPress={closeAIChat} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Messages Scroll Area */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatArea}
            contentContainerStyle={styles.chatContent}
          >
            {messages.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.messageBubble,
                  m.sender === 'user' ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    m.sender === 'user' ? styles.userText : styles.botText,
                  ]}
                >
                  {m.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Quick Prompt Suggestions */}
          <View style={styles.suggestionsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.promptChip}
                  onPress={() => handleSend(prompt)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.promptText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask about sizes, combos, showrooms..."
              placeholderTextColor={Colors.textMuted}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
              onPress={() => handleSend()}
              disabled={!input.trim()}
            >
              <Ionicons name="send" size={18} color={Colors.textInverse} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    height: '82%',
    ...Shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  botAvatar: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
    gap: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
  },
  onlineText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
  },
  botSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  closeBtn: {
    padding: 4,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  messageBubble: {
    maxWidth: '82%',
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceVariant,
    borderBottomLeftRadius: 2,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  botText: {
    color: Colors.textPrimary,
  },
  userText: {
    color: Colors.textInverse,
  },
  suggestionsContainer: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  suggestionsScroll: {
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
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.borderStrong,
  },
});
