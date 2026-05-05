import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { ABOUT_CARDS, WHATSAPP_NUMBER } from '../constants/data';

export default function AboutScreen() {
  const chatOnWhatsApp = () => {
    const msg = "Hi, I'd like to know more about HM Diamond.";
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.eyebrow}>ABOUT US</Text>
          <Text style={s.title}>Our Legacy</Text>
          <View style={s.rule} />
          <Text style={s.subtitle}>Crafting Excellence Since 2009</Text>
        </View>

        {/* Cards */}
        <View style={s.cardList}>
          {ABOUT_CARDS.map((card, i) => (
            <View key={i} style={s.card}>
              <Text style={s.cardIcon}>{card.icon}</Text>
              <Text style={s.cardTitle}>{card.title}</Text>
              <Text style={s.cardText}>{card.text}</Text>

              {card.purityTable && (
                <View style={s.table}>
                  {card.purityTable.map((row, j) => (
                    <View
                      key={j}
                      style={[s.tableRow, j < card.purityTable.length - 1 && s.tableRowBorder]}
                    >
                      <Text style={s.tableKarat}>{row.karat}</Text>
                      <Text style={s.tablePurity}>{row.purity}</Text>
                      <Text style={s.tableDesc}>{row.desc}</Text>
                    </View>
                  ))}
                </View>
              )}

              {card.badge && (
                <View style={[s.badge, card.badge.color === 'green' && s.badgeGreen]}>
                  <Text style={[s.badgeText, card.badge.color === 'green' && s.badgeTextGreen]}>
                    {card.badge.label}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={s.cta}>
          <Text style={s.ctaText}>Have a question about our jewellery?</Text>
          <TouchableOpacity style={s.ctaBtn} onPress={chatOnWhatsApp} activeOpacity={0.8}>
            <Text style={s.ctaBtnText}>Chat with Us</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  eyebrow: {
    fontFamily: 'Jost_400Regular',
    fontSize: 9,
    letterSpacing: 4,
    color: COLORS.gold,
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 30,
    color: '#fff',
    letterSpacing: 2,
  },
  rule: {
    width: 48,
    height: 1,
    backgroundColor: COLORS.gold,
    opacity: 0.5,
    marginVertical: 16,
  },
  subtitle: {
    fontFamily: 'CormorantGaramond_400Regular_Italic',
    fontSize: 16,
    color: COLORS.muted,
    letterSpacing: 1,
  },

  cardList: { padding: 16, gap: 12 },
  card: {
    backgroundColor: COLORS.bg2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 2,
    padding: 28,
  },
  cardIcon: { fontSize: 32, marginBottom: 14 },
  cardTitle: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 14,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  cardText: {
    fontFamily: 'Jost_300Light',
    fontSize: 13,
    lineHeight: 22,
    color: COLORS.muted,
  },

  table: { marginTop: 14 },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  tableRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201,168,76,0.1)',
  },
  tableKarat: {
    fontFamily: 'Cinzel_600SemiBold',
    fontSize: 14,
    color: COLORS.gold,
    width: 42,
  },
  tablePurity: {
    fontFamily: 'Jost_400Regular',
    fontSize: 13,
    color: COLORS.text,
    width: 52,
  },
  tableDesc: {
    fontFamily: 'Jost_300Light',
    fontSize: 11,
    color: COLORS.muted,
    flex: 1,
  },

  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.goldDark,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 16,
  },
  badgeGreen: { borderColor: '#2d6a2d' },
  badgeText: {
    fontFamily: 'Jost_400Regular',
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.gold,
    textTransform: 'uppercase',
  },
  badgeTextGreen: { color: '#5cb85c' },

  cta: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 20 },
  ctaText: {
    fontFamily: 'CormorantGaramond_400Regular_Italic',
    fontSize: 16,
    color: COLORS.muted,
    marginBottom: 20,
    textAlign: 'center',
  },
  ctaBtn: {
    borderWidth: 1,
    borderColor: COLORS.goldDark,
    paddingHorizontal: 36,
    paddingVertical: 14,
  },
  ctaBtnText: {
    fontFamily: 'Jost_400Regular',
    fontSize: 10,
    letterSpacing: 3,
    color: COLORS.gold,
    textTransform: 'uppercase',
  },
});
