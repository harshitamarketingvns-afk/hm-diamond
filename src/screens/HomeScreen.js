import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Image, Modal, Linking, StatusBar, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { STATS, CATEGORIES, PRODUCTS, WHATSAPP_NUMBER } from '../constants/data';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

function openWhatsApp(product) {
  const msg = product
    ? `Hi, I'm interested in: ${product.name} (${product.code}). Please share details.`
    : "Hi, I'd like to enquire about your jewellery collection.";
  Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
}

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalProduct, setModalProduct] = useState(null);

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  const categoryLabel = CATEGORIES.find(c => c.id === activeCategory)?.label ?? 'All';

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}
      >
        {/* ── Hero ── */}
        <View style={s.hero}>
          <Text style={s.heroBadge}>✦  FOR FINE DIAMOND JEWELLERY  ✦</Text>
          <Text style={s.heroTitle}>HM{'\n'}Diamond</Text>
          <Text style={s.heroSub}>Harshita Marketing</Text>
          <View style={s.heroRule} />
          <Text style={s.heroTagline}>Where Every Jewel Tells a Story</Text>
        </View>

        {/* ── Stats bar ── */}
        <View style={s.statsBar}>
          {STATS.map((stat, i) => (
            <View key={i} style={[s.statItem, i < STATS.length - 1 && s.statDivider]}>
              <Text style={s.statNum}>{stat.num}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Sticky category bar ── */}
        <View style={s.catBarOuter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catBar}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[s.catBtn, activeCategory === cat.id && s.catBtnActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Text style={[s.catLabel, activeCategory === cat.id && s.catLabelActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Section heading ── */}
        <View style={s.secHead}>
          <Text style={s.secEye}>OUR COLLECTION</Text>
          <Text style={s.secTitle}>{categoryLabel}</Text>
          <View style={s.secRule} />
          <Text style={s.secCount}>{filtered.length} PIECES</Text>
        </View>

        {/* ── Product grid ── */}
        <View style={s.grid}>
          {filtered.map(product => (
            <TouchableOpacity
              key={product.id}
              style={s.card}
              activeOpacity={0.85}
              onPress={() => setModalProduct(product)}
            >
              <View style={s.imgWrap}>
                <Image source={{ uri: product.image }} style={s.cardImg} />
              </View>
              <View style={s.cardBody}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={s.cardName} numberOfLines={1}>{product.name}</Text>
                  <Text style={s.cardCode}>{product.code}</Text>
                </View>
                <TouchableOpacity style={s.enqBtn} onPress={() => openWhatsApp(product)}>
                  <Text style={s.enqBtnText}>Enquire</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── WhatsApp FAB ── */}
      <TouchableOpacity style={s.fab} onPress={() => openWhatsApp(null)} activeOpacity={0.85}>
        <Ionicons name="logo-whatsapp" size={22} color="#fff" />
        <Text style={s.fabText}>WhatsApp</Text>
      </TouchableOpacity>

      {/* ── Product modal / lightbox ── */}
      <Modal
        visible={!!modalProduct}
        transparent
        animationType="fade"
        onRequestClose={() => setModalProduct(null)}
      >
        <View style={s.overlay}>
          <View style={s.modal}>
            {modalProduct && (
              <>
                <Image
                  source={{ uri: modalProduct.image }}
                  style={s.modalImg}
                  resizeMode="cover"
                />
                <Text style={s.modalName}>{modalProduct.name}</Text>
                <Text style={s.modalCode}>{modalProduct.code}</Text>
                <TouchableOpacity
                  style={s.modalWaBtn}
                  onPress={() => { openWhatsApp(modalProduct); setModalProduct(null); }}
                >
                  <Ionicons name="logo-whatsapp" size={18} color="#fff" />
                  <Text style={s.modalWaText}>Enquire on WhatsApp</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={s.modalClose} onPress={() => setModalProduct(null)}>
              <Ionicons name="close" size={28} color={COLORS.muted} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  // Hero
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
    backgroundColor: COLORS.bg,
  },
  heroBadge: {
    fontFamily: 'Jost_400Regular',
    fontSize: 10,
    letterSpacing: 4,
    color: COLORS.gold,
    marginBottom: 20,
  },
  heroTitle: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 58,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 62,
    marginBottom: 10,
  },
  heroSub: {
    fontFamily: 'CormorantGaramond_400Regular_Italic',
    fontSize: 22,
    color: COLORS.goldLight,
    marginBottom: 20,
  },
  heroRule: {
    width: 80,
    height: 1,
    backgroundColor: COLORS.gold,
    opacity: 0.5,
    marginBottom: 20,
  },
  heroTagline: {
    fontFamily: 'CormorantGaramond_300Light_Italic',
    fontSize: 15,
    color: COLORS.muted,
    letterSpacing: 1,
  },

  // Stats
  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.bg2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: { flex: 1, paddingVertical: 18, alignItems: 'center' },
  statDivider: { borderRightWidth: 1, borderRightColor: COLORS.border },
  statNum: { fontFamily: 'Cinzel_400Regular', fontSize: 20, color: COLORS.gold },
  statLabel: {
    fontFamily: 'Jost_300Light',
    fontSize: 9,
    color: COLORS.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 4,
  },

  // Category bar
  catBarOuter: {
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  catBar: { paddingHorizontal: 8 },
  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  catBtnActive: { borderBottomColor: COLORS.gold },
  catLabel: {
    fontFamily: 'Jost_400Regular',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: COLORS.muted,
  },
  catLabelActive: { color: COLORS.gold },

  // Section heading
  secHead: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20 },
  secEye: {
    fontFamily: 'Jost_400Regular',
    fontSize: 9,
    letterSpacing: 4,
    color: COLORS.gold,
    marginBottom: 8,
  },
  secTitle: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 24,
    color: '#fff',
    letterSpacing: 2,
  },
  secRule: {
    width: 48,
    height: 1,
    backgroundColor: COLORS.gold,
    opacity: 0.5,
    marginVertical: 12,
  },
  secCount: {
    fontFamily: 'Jost_300Light',
    fontSize: 10,
    color: COLORS.muted,
    letterSpacing: 2,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  imgWrap: { width: '100%', aspectRatio: 1, backgroundColor: '#1a1810' },
  cardImg: { width: '100%', height: '100%' },
  cardBody: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardName: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 13,
    color: COLORS.text,
  },
  cardCode: {
    fontFamily: 'Jost_300Light',
    fontSize: 9,
    color: COLORS.goldDark,
    marginTop: 2,
  },
  enqBtn: {
    borderWidth: 1,
    borderColor: COLORS.goldDark,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  enqBtnText: {
    fontFamily: 'Jost_400Regular',
    fontSize: 8,
    letterSpacing: 1,
    color: COLORS.gold,
    textTransform: 'uppercase',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.whatsapp,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 30,
    gap: 8,
    elevation: 8,
    shadowColor: COLORS.whatsapp,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabText: { fontFamily: 'Jost_400Regular', fontSize: 13, color: '#fff' },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.93)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    backgroundColor: COLORS.bg2,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    padding: 20,
  },
  modalImg: {
    width: '100%',
    height: 300,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalName: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 18,
    color: COLORS.gold,
    textAlign: 'center',
    marginTop: 16,
  },
  modalCode: {
    fontFamily: 'Jost_300Light',
    fontSize: 11,
    color: COLORS.muted,
    letterSpacing: 2,
    marginTop: 4,
  },
  modalWaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.whatsapp,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 8,
    marginTop: 20,
  },
  modalWaText: { fontFamily: 'Jost_400Regular', fontSize: 13, color: '#fff' },
  modalClose: { position: 'absolute', top: 10, right: 10 },
});
