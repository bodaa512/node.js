import mongoose from 'mongoose';
import { env } from '../config/env';
import { AssetCategory } from '../models/AssetCategory';
import { Plan } from '../models/Plan';
import { BlogPost } from '../models/BlogPost';
import { User } from '../models/User';
import { Home } from '../models/Home';
import { Room } from '../models/Room';
import { Asset } from '../models/Asset';
import { MaintenanceTask } from '../models/MaintenanceTask';
import { Expense } from '../models/Expense';
import { ProviderProfile } from '../models/ProviderProfile';
import { hashPassword } from '../utils/hash';
import {
  UserRole,
  HomeType,
  OwnershipType,
  RoomType,
  AssetCondition,
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceType,
  ExpenseCategory,
  PaymentMethod,
  ServiceCategory,
  VerificationStatus,
  SubscriptionPlan,
  PlanType,
  BlogStatus,
} from '../types/enums';

export async function seedDatabase() {
  console.log('🌱 Seeding HomePilot Database with realistic initial data...');

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(env.MONGO_URI);
    }

    // 1. Seed Asset Categories
    const existingCategories = await AssetCategory.countDocuments();
    if (existingCategories === 0) {
      await AssetCategory.create([
        {
          name: 'HVAC & Climate',
          slug: 'hvac-climate',
          icon: 'air-vent',
          expectedLifespanYears: 12,
          defaultMaintenanceSchedule: [
            { task: 'Clean Air Filter', intervalDays: 30, description: 'Wash or replace air conditioning filters.' },
            { task: 'Full HVAC Servicing & Gas Check', intervalDays: 180, description: 'Professional technician maintenance.' },
          ],
        },
        {
          name: 'Kitchen Appliances',
          slug: 'kitchen-appliances',
          icon: 'refrigerator',
          expectedLifespanYears: 10,
          defaultMaintenanceSchedule: [
            { task: 'Clean Condenser Coils', intervalDays: 180, description: 'Vacuum coils behind refrigerator.' },
            { task: 'Descale Dishwasher & Filter', intervalDays: 60, description: 'Run cleaning cycle with vinegar or descaler.' },
          ],
        },
        {
          name: 'Laundry & Washing',
          slug: 'laundry-washing',
          icon: 'washing-machine',
          expectedLifespanYears: 8,
          defaultMaintenanceSchedule: [
            { task: 'Drum Cleaning Cycle', intervalDays: 60, description: 'Run hot tub clean cycle.' },
            { task: 'Inspect Drain Filter', intervalDays: 90, description: 'Clean debris from bottom coin trap.' },
          ],
        },
        {
          name: 'Plumbing & Water Systems',
          slug: 'plumbing-water',
          icon: 'faucet',
          expectedLifespanYears: 15,
          defaultMaintenanceSchedule: [
            { task: 'Water Heater Safety Inspection', intervalDays: 180, description: 'Test pressure relief valve and check leaks.' },
            { task: 'Water Filter Replacement', intervalDays: 90, description: 'Replace inline water filter cartridge.' },
          ],
        },
        {
          name: 'Security & Smart Home',
          slug: 'security-smart-home',
          icon: 'shield-check',
          expectedLifespanYears: 5,
          defaultMaintenanceSchedule: [
            { task: 'Firmware Update & Lens Clean', intervalDays: 90, description: 'Update smart camera software.' },
          ],
        },
      ]);
      console.log('✅ Asset categories seeded.');
    }

    // 2. Seed Plans
    const existingPlans = await Plan.countDocuments();
    if (existingPlans === 0) {
      await Plan.create([
        {
          name: 'Free Starter',
          slug: 'free',
          type: PlanType.USER,
          price: 0,
          currency: 'EGP',
          billingPeriod: 'monthly',
          displayOrder: 1,
          features: {
            maxHomes: 1,
            maxAssets: 10,
            maxDocuments: 20,
            maxAIRequests: 10,
            familyCollaboration: false,
            advancedAnalytics: false,
            homeHealthScore: true,
            homeMemory: false,
            prioritySupport: false,
          },
        },
        {
          name: 'HomePilot Premium',
          slug: 'premium',
          type: PlanType.USER,
          price: 299,
          currency: 'EGP',
          billingPeriod: 'monthly',
          displayOrder: 2,
          features: {
            maxHomes: 5,
            maxAssets: 999,
            maxDocuments: 999,
            maxAIRequests: 100,
            familyCollaboration: true,
            advancedAnalytics: true,
            homeHealthScore: true,
            homeMemory: true,
            prioritySupport: true,
          },
        },
        {
          name: 'Property Pro',
          slug: 'property_pro',
          type: PlanType.USER,
          price: 899,
          currency: 'EGP',
          billingPeriod: 'monthly',
          displayOrder: 3,
          features: {
            maxHomes: 25,
            maxAssets: 9999,
            maxDocuments: 9999,
            maxAIRequests: 500,
            familyCollaboration: true,
            advancedAnalytics: true,
            homeHealthScore: true,
            homeMemory: true,
            prioritySupport: true,
          },
        },
      ]);
      console.log('✅ SaaS subscription plans seeded.');
    }

    // 3. Seed Demo User & Home
    const existingDemo = await User.findOne({ email: 'demo@homepilot.com' });
    if (!existingDemo) {
      const hashedPassword = await hashPassword('Password123!');
      const demoUser = await User.create({
        email: 'demo@homepilot.com',
        password: hashedPassword,
        firstName: 'Ahmed',
        lastName: 'Hassan',
        phone: '+201001234567',
        role: UserRole.HOMEOWNER,
        emailVerified: true,
        subscription: {
          plan: SubscriptionPlan.PREMIUM,
          status: 'active',
        },
        onboarding: {
          completed: true,
          currentStep: 9,
          completedSteps: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        },
      });

      const demoHome = await Home.create({
        owner: demoUser._id,
        name: 'Cairo Family Residence',
        type: HomeType.APARTMENT,
        address: {
          street: '12 Nile Corniche, Maadi',
          city: 'Cairo',
          state: 'Cairo Governorate',
          country: 'Egypt',
          postalCode: '11431',
        },
        ownershipType: OwnershipType.OWNED,
        numberOfRooms: 5,
        numberOfResidents: 4,
        area: 180,
        areaUnit: 'sqm',
        notes: 'Main residence apartment overlooking the Nile.',
        healthScore: {
          score: 84,
          lastCalculated: new Date(),
          breakdown: {
            maintenance: 85,
            warranty: 90,
            assetCondition: 80,
            documentCompleteness: 75,
            repairHistory: 85,
            expenseStability: 90,
            safety: 80,
          },
        },
      });

      const livingRoom = await Room.create({ home: demoHome._id, name: 'Living Room', type: RoomType.LIVING_ROOM, floor: 3, assetCount: 2 });
      const kitchen = await Room.create({ home: demoHome._id, name: 'Kitchen', type: RoomType.KITCHEN, floor: 3, assetCount: 3 });
      const masterBedroom = await Room.create({ home: demoHome._id, name: 'Master Bedroom', type: RoomType.BEDROOM, floor: 3, assetCount: 2 });

      const acCategory = await AssetCategory.findOne({ slug: 'hvac-climate' });
      const fridgeCategory = await AssetCategory.findOne({ slug: 'kitchen-appliances' });
      const laundryCategory = await AssetCategory.findOne({ slug: 'laundry-washing' });

      const fridge = await Asset.create({
        home: demoHome._id,
        room: kitchen._id,
        category: fridgeCategory?._id,
        name: 'Samsung Double Door Refrigerator',
        brand: 'Samsung',
        model: 'RT50K6330SL',
        serialNumber: 'SN-SAMS-99882',
        purchaseDate: new Date('2023-05-10'),
        purchasePrice: 38000,
        currency: 'EGP',
        condition: AssetCondition.GOOD,
        expectedLifespanYears: 10,
        warranty: {
          hasWarranty: true,
          startDate: new Date('2023-05-10'),
          endDate: new Date('2028-05-10'),
          provider: 'Samsung Egypt',
          coverage: '5-Year Compressor Warranty',
        },
        maintenance: { totalCost: 1200, totalRepairs: 1 },
      });

      const ac = await Asset.create({
        home: demoHome._id,
        room: livingRoom._id,
        category: acCategory?._id,
        name: 'LG Dual Inverter Air Conditioner',
        brand: 'LG',
        model: 'S4-Q18JA3ZA',
        serialNumber: 'SN-LGAC-44102',
        purchaseDate: new Date('2022-04-15'),
        purchasePrice: 22000,
        currency: 'EGP',
        condition: AssetCondition.FAIR,
        expectedLifespanYears: 10,
        warranty: {
          hasWarranty: true,
          startDate: new Date('2022-04-15'),
          endDate: new Date('2027-04-15'),
          provider: 'LG Service Egypt',
        },
        maintenance: { totalCost: 2800, totalRepairs: 2 },
      });

      await MaintenanceTask.create([
        {
          home: demoHome._id,
          asset: ac._id,
          room: livingRoom._id,
          title: 'AC Air Filter Cleaning & Service',
          description: 'Clean dust filters and check cooling performance.',
          type: MaintenanceType.RECURRING,
          priority: MaintenancePriority.HIGH,
          status: MaintenanceStatus.PENDING,
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          estimatedCost: 350,
          createdBy: demoUser._id,
        },
        {
          home: demoHome._id,
          asset: fridge._id,
          room: kitchen._id,
          title: 'Refrigerator Condenser Coil Vacuuming',
          description: 'Clear accumulated dust from back radiator coils.',
          type: MaintenanceType.RECURRING,
          priority: MaintenancePriority.MEDIUM,
          status: MaintenanceStatus.COMPLETED,
          completedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          actualCost: 0,
          createdBy: demoUser._id,
        },
      ]);

      await Expense.create([
        { home: demoHome._id, category: ExpenseCategory.ELECTRICITY, amount: 1450, currency: 'EGP', date: new Date('2026-08-01'), paymentMethod: PaymentMethod.ONLINE, description: 'Monthly electricity bill', isRecurring: true, createdBy: demoUser._id },
        { home: demoHome._id, category: ExpenseCategory.INTERNET, amount: 550, currency: 'EGP', date: new Date('2026-08-05'), paymentMethod: PaymentMethod.CARD, description: 'WE High-Speed Fiber Internet', isRecurring: true, createdBy: demoUser._id },
        { home: demoHome._id, category: ExpenseCategory.REPAIRS, amount: 850, currency: 'EGP', date: new Date('2026-07-20'), paymentMethod: PaymentMethod.CASH, description: 'Plumbing leak repair in kitchen sink', isRecurring: false, createdBy: demoUser._id },
      ]);

      // Seed Provider
      const providerUser = await User.create({
        email: 'technician@homepilot.com',
        password: hashedPassword,
        firstName: 'Mahmoud',
        lastName: 'El-Sayed',
        phone: '+201229876543',
        role: UserRole.PROVIDER,
        emailVerified: true,
      });

      await ProviderProfile.create({
        user: providerUser._id,
        businessName: 'Nile Breeze HVAC & Appliance Repair',
        description: 'Certified HVAC engineer specializing in inverter AC systems, refrigerators, and major home appliances with 12+ years experience across Cairo.',
        categories: [ServiceCategory.AC, ServiceCategory.APPLIANCE_REPAIR, ServiceCategory.ELECTRICITY],
        serviceAreas: [{ city: 'Cairo', country: 'Egypt' }, { city: 'Giza', country: 'Egypt' }],
        experience: 12,
        verificationStatus: VerificationStatus.VERIFIED,
        rating: { average: 4.9, count: 28, breakdown: { professionalism: 5, punctuality: 4.8, quality: 5, communication: 4.9, value: 4.8 } },
        completedJobs: 45,
      });

      console.log('✅ Demo user, home, assets, maintenance, expenses, and provider seeded.');
    }

    // 4. Seed Blog Posts
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0) {
      const admin = await User.findOne();
      if (admin) {
        await BlogPost.create([
          {
            author: admin._id,
            title: '10 Essential Home Maintenance Tasks You Should Never Ignore',
            slug: '10-essential-home-maintenance-tasks',
            content: 'Regular home maintenance prevents costly emergency repairs. From AC filter cleaning to inspecting water heater relief valves, staying proactive saves thousands each year...',
            excerpt: 'Learn the critical home maintenance checklist every homeowner should follow every season.',
            category: 'Maintenance',
            tags: ['maintenance', 'tips', 'saving-money'],
            status: BlogStatus.PUBLISHED,
            publishedAt: new Date(),
          },
          {
            author: admin._id,
            title: 'Repair vs. Replace: How to Make the Economic Choice for Broken Appliances',
            slug: 'repair-vs-replace-guide',
            content: 'When a major appliance breaks down, deciding whether to repair or replace can be tricky. Use the 50% rule: if repair cost exceeds 50% of a replacement unit and the asset is past half its lifespan, replacement is generally wiser...',
            excerpt: 'How to calculate whether repairing your appliance makes financial sense.',
            category: 'Appliances',
            tags: ['appliances', 'repair-replace', 'budgeting'],
            status: BlogStatus.PUBLISHED,
            publishedAt: new Date(),
          },
        ]);
        console.log('✅ Blog posts seeded.');
      }
    }

    console.log('🎉 Seeding complete!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
}
