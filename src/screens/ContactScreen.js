import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { CONTACT_INFO, WHATSAPP_NUMBER } from '../constants/data';

const ITEMS = [
  {
    icon: 'call-outline',
    label: 'Phone',
    value: CONTACT_INFO.phone,
    action: () => Linking.openURL(`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`),
  },
  {
    icon: 'logo-whatsapp',
    label: 'WhatsApp',
    value: CONTACT_INFO.whatsapp,
    action: () => Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}`),
    iconColor: COLORS.whatsapp,
  },
  {
    icon: 'mail-outline',
    label: 'Email',
    value: CONTACT_INFO.email,
    action: () => Linking.openURL(`mailto:${CONTACT_INFO.email}`),
  },
  {
    icon: 'location-outline',
    label: 'Address',
    value: CONTACT_INFO.address,
  },
  {
    icon: 'time-outline',
    label: 'Hours',
    value: CONTACT_INFO.hours,
  },
];

export default function ContactScreen() {
  const enquireOnWhatsApp = () => {
    const msg = "Hi, I'd like to enquire about your jewellery collection.";
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.eyebrow}>GET IN TOUCH</Text>
          <Text style={s.title}>Contact Us</Text>
          <View style={s.rule} />
          <Text style={s.subtitle}>We'd Love to Hear from You</Text>
        </View>

        {/* Contact items */}
        <View style={s.grid}>
          {ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={s.item}
              onPress={item.action}
              disabled={!item.action}
              activeOpacity={item.action ? 0.75 : 1}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={item.iconColor ?? COLORS.gold}
                style={s.itemIcon}
              />
              <Text style={s.itemLabel}>{item.label}</Text>
              <Text style={[s.itemValue, !!item.action && s.itemLink]}>{item.value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* WhatsApp CTA */}
        <TouchableOpacity style={s.waCta} onPress={enquireOnWhatsApp} activeOpacity={0.85}>
          <Ionicons name="logo-whatsapp" size={22} color="#fff" />
          <Text style={s.waCtaText}>Enquire on WhatsApp</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerBrand}>HM DIAMOND</Text>
          <Text style={s.footerCopy}>© 2024 Harshita Marketing. All rights reserved.</Text>
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
  },

  grid: { padding: 16, gap: 10 },
  item: {
    backgroundColor: COLORS.bg2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 2,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  itemIcon: { marginBottom: 10 },
  itemLabel: {
    fontFamily: 'Jost_400Regular',
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: COLORS.gold,
    marginBottom: 8,
  },
  itemValue: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 15,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  itemLink: { color: COLORS.goldLight },

  waCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.whatsapp,
    marginHorizontal: 16,
    marginTop: 4,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
    elevation: 6,
    shadowColor: COLORS.whatsapp,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  waCtaText: { fontFamily: 'Jost_400Regular', fontSize: 14, color: '#fff' },

  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    marginHorizontal: 16,
    marginTop: 28,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerBrand: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 13,
    letterSpacing: 3,
    color: COLORS.gold,
    marginBottom: 8,
  },
  footerCopy: {
    fontFamily: 'Jost_300Light',
    fontSize: 10,
    color: COLORS.muted,
    letterSpacing: 1,
  },
});
