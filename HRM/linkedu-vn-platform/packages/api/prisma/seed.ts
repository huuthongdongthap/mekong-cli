// =============================================================================
// LinkEduVN — Database Seed Data
// =============================================================================
// Usage:
//   DATABASE_URL=postgresql://linkededu:linkededu@localhost:5432/linkededu
//   npx prisma db seed
// =============================================================================

import { PrismaClient, UserRole, SchoolType, VnRegion, DistrictType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const hash = (plain: string) => bcrypt.hashSync(plain, 10);

const PASSWORD_HASH = hash('LinkedEdu@2026!');

const recent = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 86400000);

// ---------------------------------------------------------------------------
// 1. Provinces
// ---------------------------------------------------------------------------

const PROVINCES = [
  // NORTH
  { code: '01', name: 'Thành phố Hà Nội',    nameEn: 'Hanoi',           region: VnRegion.north },
  { code: '02', name: 'Tỉnh Hải Phòng',      nameEn: 'Hai Phong',       region: VnRegion.north },
  { code: '03', name: 'Tỉnh Bắc Ninh',       nameEn: 'Bac Ninh',        region: VnRegion.north },
  { code: '04', name: 'Tỉnh Bắc Giang',      nameEn: 'Bac Giang',       region: VnRegion.north },
  // CENTRAL
  { code: '48', name: 'Thành phố Đà Nẵng',   nameEn: 'Da Nang',         region: VnRegion.central },
  { code: '49', name: 'Tỉnh Quảng Nam',      nameEn: 'Quang Nam',       region: VnRegion.central },
  // SOUTH
  { code: '79', name: 'Thành phố Hồ Chí Minh', nameEn: 'Ho Chi Minh City', region: VnRegion.south },
  { code: '80', name: 'Tỉnh Bình Dương',     nameEn: 'Binh Duong',      region: VnRegion.south },
];

// ---------------------------------------------------------------------------
// 2. Districts
// ---------------------------------------------------------------------------

const DISTRICTS: { provinceCode: string; name: string; type: DistrictType }[] = [
  // Hà Nội (01)
  { provinceCode: '01', name: 'Quận Hoàn Kiếm',       type: DistrictType.quan },
  { provinceCode: '01', name: 'Quận Ba Đình',         type: DistrictType.quan },
  { provinceCode: '01', name: 'Quận Hai Bà Trưng',    type: DistrictType.quan },
  { provinceCode: '01', name: 'Quận Thanh Xuân',      type: DistrictType.quan },
  { provinceCode: '01', name: 'Huyện Đông Anh',       type: DistrictType.huyen },
  // Hải Phòng (02)
  { provinceCode: '02', name: 'Quận Hồng Bàng',       type: DistrictType.quan },
  { provinceCode: '02', name: 'Quận Ngô Quyền',       type: DistrictType.quan },
  // Bắc Ninh (03)
  { provinceCode: '03', name: 'Thành phố Bắc Ninh',   type: DistrictType.thanh_pho },
  { provinceCode: '03', name: 'Huyện Từ Sơn',         type: DistrictType.huyen },
  // Bắc Giang (04)
  { provinceCode: '04', name: 'Thành phố Bắc Giang',  type: DistrictType.thanh_pho },
  // Đà Nẵng (48)
  { provinceCode: '48', name: 'Quận Hải Châu',        type: DistrictType.quan },
  { provinceCode: '48', name: 'Quận Thanh Khê',       type: DistrictType.quan },
  // Quảng Nam (49)
  { provinceCode: '49', name: 'Thành phố Tam Kỳ',     type: DistrictType.thanh_pho },
  { provinceCode: '49', name: 'Thị xã Hội An',        type: DistrictType.thi_xa },
  // TP.HCM (79)
  { provinceCode: '79', name: 'Quận 1',               type: DistrictType.quan },
  { provinceCode: '79', name: 'Quận 3',               type: DistrictType.quan },
  { provinceCode: '79', name: 'Quận Bình Thạnh',      type: DistrictType.quan },
  { provinceCode: '79', name: 'Quận Thủ Đức',         type: DistrictType.quan },
  { provinceCode: '79', name: 'Huyện Bình Chánh',     type: DistrictType.huyen },
  // Bình Dương (80)
  { provinceCode: '80', name: 'Thành phố Thủ Dầu Một', type: DistrictType.thanh_pho },
  { provinceCode: '80', name: 'Thị xã Dĩ An',         type: DistrictType.thi_xa },
];

// ---------------------------------------------------------------------------
// 3. Users (one per future role — created before soft-linked entities)
//    Super Admin + 1 admin per school/enterprise + 20 learners
// ---------------------------------------------------------------------------

// Full name → user seed data: (first, last, email, role, schoolId?, enterpriseId?)
type UserSeed = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  schoolId?: string | null;
  enterpriseId?: number | null;
};

// Build school seeds first to get IDs, then enterprise IDs, then users.
// We'll do a two-pass approach using raw data.

const SCHOOL_USERS: { firstName: string; lastName: string; email: string }[] = [
  { firstName: 'Nguyễn',    lastName: 'Văn An',     email: 'an.nguyen@tcnhcm.edu.vn' },
  { firstName: 'Trần',      lastName: 'Thị Bình',   email: 'binh.tran@cdhn.edu.vn'   },
  { firstName: 'Lê',        lastName: 'Hoàng Cường', email: 'cuong.le@dhdn.edu.vn'    },
];

const ENTERPRISE_USERS: { firstName: string; lastName: string; email: string }[] = [
  { firstName: 'Phạm',      lastName: 'Minh Đức',   email: 'duc.pham@viettel.com.vn'  },
  { firstName: 'Hoàng',     lastName: 'Thu Hà',     email: 'ha.hoang@vinalines.com.vn'},
  { firstName: 'Vũ',        lastName: 'Đình Kiên',  email: 'kien.vu@samsung.com'      },
  { firstName: 'Đặng',      lastName: 'Tuấn Linh',  email: 'linh.dang@vinmec.com.vn'  },
  { firstName: 'Bùi',       lastName: 'Nhật Minh',  email: 'minh.bui@samsungbip.com'  },
];

// Learner names (Vietnamese surnames + middle + given name pattern)
const LEARNER_NAMES = [
  'Nguyễn Văn Tuấn',     'Trần Thị Mai',         'Lê Hoàng Nam',
  'Phạm Thị Lan',        'Hoàng Minh Đức',       'Vũ Ngọc Sơn',
  'Đặng Thị Hương',      'Bùi Quang Huy',        'Đỗ Thị Thu',
  'Nguyễn Phú Cường',    'Trần Văn Hiếu',        'Lê Thị Ngọc',
  'Phạm Hoàng Long',     'Hoàng Thị Bích',       'Vũ Đình Tuấn',
  'Đặng Quốc Khánh',    'Bùi Thị Hà',           'Đỗ Văn Thành',
  'Nguyễn Thị Diệu',    'Trần Hoàng Phúc',
];

// =============================================================================
// Seed function
// =============================================================================

async function main() {
  console.log('🌱 Starting LinkEduVN seed...\n');

  // -- Provinces ------------------------------------------------------------
  console.log('📌 Seeding provinces...');
  await prisma.province.createMany({ data: PROVINCES, skipDuplicates: true });

  // -- Districts ------------------------------------------------------------
  console.log('📌 Seeding districts...');
  await prisma.district.createMany({
    data: DISTRICTS.map(d => ({
      provinceCode: d.provinceCode,
      name: d.name,
      type: d.type,
      id: 0, // ignored for createMany with skipDuplicates when needed; using raw SQL instead
    })).filter(Boolean),
    skipDuplicates: true,
  });

  // Use raw INSERT to properly seed composite PK districts
  for (const d of DISTRICTS) {
    await prisma.$executeRaw`
      INSERT INTO districts ("province_code", name, "type")
      VALUES (${d.provinceCode}, ${d.name}, ${d.type}::district_type)
      ON CONFLICT DO NOTHING
    `;
  }

  // -- Schools ---------------------------------------------------------------
  console.log('🏫 Seeding schools...');
  const school1 = await prisma.school.create({
    data: {
      code: 'TC-HCM-001',
      name: 'Trường Trung cấp nghề TP.HCM',
      nameEn: 'Ho Chi Minh City Vocational College',
      schoolType: SchoolType.nghe_nghiep,
      address: '345 Nguyễn Văn Linh, Quận 7',
      provinceCode: '79',
      districtId: 1,
      phone: '028-1234-5678',
      email: 'info@tcnhcm.edu.vn',
      directorName: 'Ông Nguyễn Văn A',
      taxCode: '0301234567',
      qlgdnnCode: 'QLGDNN63120001',
      verificationStatus: SchoolStatus.active,
      status: SchoolStatus.active,
    },
  });

  const school2 = await prisma.school.create({
    data: {
      code: 'CD-HN-001',
      name: 'Trường Cao đẳng Công nghệ Hà Nội',
      nameEn: 'Hanoi Technology College',
      schoolType: SchoolType.cao_dang,
      address: '88 Nguyễn Trãi, Thanh Xuân',
      provinceCode: '01',
      districtId: 4,
      phone: '024-8765-4321',
      email: 'info@cdhn.edu.vn',
      directorName: 'Bà Trần Thị B',
      taxCode: '0100987654',
      qlgdnnCode: 'QLGDNN01010001',
      verificationStatus: SchoolStatus.active,
      status: SchoolStatus.active,
    },
  });

  const school3 = await prisma.school.create({
    data: {
      code: 'DH-DN-001',
      name: 'Trường Đại học Đà Nẵng',
      nameEn: 'University of Da Nang',
      schoolType: SchoolType.dai_hoc,
      address: '254 Nguyễn Văn Linh, Hải Châu',
      provinceCode: '48',
      districtId: 10,
      phone: '0236-555-8888',
      email: 'info@dhdn.edu.vn',
      directorName: 'PGS.TS Lê Hoàng C',
      taxCode: '0405678901',
      qlgdnnCode: 'QLGDNN48010001',
      verificationStatus: SchoolStatus.active,
      status: SchoolStatus.active,
    },
  });

  // -- School contacts -------------------------------------------------------
  await prisma.schoolContact.create({
    data: {
      schoolId: school1.id,
      name: 'Bà Nguyễn Thị Liên',
      position: 'Phó Hiệu trường',
      phone: '0909123456',
      email: 'lien.nguyen@tcnhcm.edu.vn',
      isPrimary: true,
    },
  });
  await prisma.schoolContact.create({
    data: {
      schoolId: school2.id,
      name: 'Ông Trần Văn Hùng',
      position: 'Trưởng phòng Hợp tác doanh nghiệp',
      phone: '0912345678',
      email: 'hung.tran@cdhn.edu.vn',
      isPrimary: true,
    },
  });
  await prisma.schoolContact.create({
    data: {
      schoolId: school3.id,
      name: 'Bà Lê Thị Mai',
      position: 'Giám đốc Trung tâm Hợp tác',
      phone: '0933456789',
      email: 'mai.le@dhdn.edu.vn',
      isPrimary: true,
    },
  });

  // -- Enterprise users (need enterpriseId later, create users after enterprise)
  // We'll store them in memory first, then link in second pass.
  // For Prisma simplicity, we create users without FK, then update.

  // -- Enterprises ------------------------------------------------------------
  console.log('🏢 Seeding enterprises...');

  const ent1 = await prisma.enterprise.create({
    data: {
      name: 'Tập đoàn Viettel',
      nameEn: 'Viettel Group',
      taxCode: '0100109553',
      industry: EnterpriseIndustry.IT,
      address: 'Lô T2, Đường Trần Đăng Ninh, Cầu Giấy',
      provinceCode: '01',
      districtId: 1,
      phone: '024-3566-6868',
      email: 'contact@viettel.com.vn',
      website: 'https://viettel.com.vn',
      contactName: 'Ông Phạm Minh Đức',
      contactPosition: 'Giám đốc Nhân sự',
      contactPhone: '0988123456',
      contactEmail: 'duc.pham@viettel.com.vn',
      employeeCount: 25000,
      description: 'Tập đoàn viễn thông hàng đầu Việt Nam, hoạt động trong lĩnh vực CNTT, viễn thông và an ninh mạng.',
      status: EnterpriseStatus.active,
    },
  });

  const ent2 = await prisma.enterprise.create({
    data: {
      name: 'Tổng công ty Hàng hải Việt Nam (Vinalines)',
      nameEn: 'Vinalines Corporation',
      taxCode: '0100109413',
      industry: EnterpriseIndustry.Logistics,
      address: 'Số 5 Nguyễn Thị Duệ, Ba Đình',
      provinceCode: '01',
      districtId: 2,
      phone: '024-3944-4288',
      email: 'contact@vinalines.com.vn',
      website: 'https://vinalines.com.vn',
      contactName: 'Bà Hoàng Thu Hà',
      contactPosition: 'Phó Tổng giám đốc',
      contactPhone: '0912345678',
      contactEmail: 'ha.hoang@vinalines.com.vn',
      employeeCount: 8000,
      description: 'Tổng công ty vận tải biển và logistics hàng đầu Việt Nam.',
      status: EnterpriseStatus.active,
    },
  });

  const ent3 = await prisma.enterprise.create({
    data: {
      name: 'Samsung Electronics Việt Nam',
      nameEn: 'Samsung Electronics Vietnam',
      taxCode: '0304290214',
      industry: EnterpriseIndustry.Semiconductor,
      address: 'Khu công nghiệp Yên Phong, Bắc Ninh',
      provinceCode: '03',
      districtId: 8,
      phone: '0222-123-4567',
      email: 'vn.info@samsung.com',
      website: 'https://samsung.com/vn',
      contactName: 'Ông Vũ Đình Kiên',
      contactPosition: 'Giám đốc Đào tạo & Nhân sự',
      contactPhone: '0978123456',
      contactEmail: 'kien.vu@samsung.com',
      employeeCount: 160000,
      description: 'Nhà máy sản xuất điện thoại, điện tử và bán dẫn lớn nhất Việt Nam.',
      status: EnterpriseStatus.active,
    },
  });

  const ent4 = await prisma.enterprise.create({
    data: {
      name: 'Bệnh viện Vinmec',
      nameEn: 'Vinmec Healthcare System',
      taxCode: '0105525124',
      industry: EnterpriseIndustry.Healthcare,
      address: '458 Nguyễn Hữu Thọ, Quận 7, TP.HCM',
      provinceCode: '79',
      districtId: 1,
      phone: '028-7300-2345',
      email: 'contact@vinmec.com',
      website: 'https://vinmec.com',
      contactName: 'Bà Đặng Tuấn Linh',
      contactPosition: 'Giám đốc Nhân sự',
      contactPhone: '0908234567',
      contactEmail: 'linh.dang@vinmec.com.vn',
      employeeCount: 7500,
      description: 'Hệ thống bệnh viện và clinic hàng đầu Việt Nam.',
      status: EnterpriseStatus.active,
    },
  });

  const ent5 = await prisma.enterprise.create({
    data: {
      name: 'Samsung Display Vietnam',
      nameEn: 'Samsung Display Vietnam',
      taxCode: '2400350621',
      industry: EnterpriseIndustry.Semiconductor,
      address: 'Khu công nghiệp Quang Châu, Bắc Giang',
      provinceCode: '04',
      districtId: 3,
      phone: '02094-123-456',
      email: 'info@samsungbip.com',
      website: 'https://samsungdisplay.com',
      contactName: 'Ông Bùi Nhật Minh',
      contactPosition: 'Giám đốc Nhân sự',
      contactPhone: '0967345678',
      contactEmail: 'minh.bui@samsungbip.com',
      employeeCount: 12000,
      description: 'Nhà máy sản xuất màn hình OLED hàng đầu Đông Nam Á.',
      status: EnterpriseStatus.active,
    },
  });

  // -- Enterprise contacts ---------------------------------------------------
  await prisma.enterpriseContact.createMany({
    data: [
      { enterpriseId: ent1.id, name: 'Phạm Minh Đức', position: 'Giám đốc Nhân sự', phone: '0988123456', email: 'duc.pham@viettel.com.vn', isPrimary: true },
      { enterpriseId: ent1.id, name: 'Nguyễn Văn Hải', position: 'Trưởng phòng Đào tạo', phone: '0988123000', email: 'hai.nguyen@viettel.com.vn' },
      { enterpriseId: ent2.id, name: 'Hoàng Thu Hà', position: 'Phó Tổng giám đốc', phone: '0912345678', email: 'ha.hoang@vinalines.com.vn', isPrimary: true },
      { enterpriseId: ent3.id, name: 'Vũ Đình Kiên', position: 'Giám đốc Đào tạo', phone: '0978123456', email: 'kien.vu@samsung.com', isPrimary: true },
      { enterpriseId: ent3.id, name: 'Park Ji-hoon', position: 'HR Director', phone: '0978999000', email: 'park.jihoon@samsung.com' },
      { enterpriseId: ent4.id, name: 'Đặng Tuấn Linh', position: 'Giám đốc Nhân sự', phone: '0908234567', email: 'linh.dang@vinmec.com.vn', isPrimary: true },
      { enterpriseId: ent5.id, name: 'Bùi Nhật Minh', position: 'HR Director', phone: '0967345678', email: 'minh.bui@samsungbip.com', isPrimary: true },
    ],
    skipDuplicates: true,
  });

  // -- Users -----------------------------------------------------------------
  console.log('👤 Seeding users...');

  // Super admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@linkededu.vn',
      phone: '0900000001',
      passwordHash: PASSWORD_HASH,
      emailVerified: true,
      role: UserRole.super_admin,
      firstName: 'Admin',
      lastName: 'System',
    },
  });

  // School staff
  const [schoolAdmin1] = await prisma.user.createMany({
    data: SCHOOL_USERS.map(u => ({
      ...u,
      passwordHash: PASSWORD_HASH,
      emailVerified: true,
      role: u.email.includes('tcnhcm')
        ? UserRole.school_admin : u.email.includes('cdhn')
          ? UserRole.school_admin
          : UserRole.school_admin,
      schoolId: u.email.includes('tcnhcm')
        ? school1.id : u.email.includes('cdhn')
          ? school2.id
          : school3.id,
    })),
    skipDuplicates: true,
  });

  const schoolAdmins = await prisma.user.findMany({
    where: { role: UserRole.school_admin },
  });

  // Enterprise staff
  await prisma.user.createMany({
    data: ENTERPRISE_USERS.map((u, i) => ({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: `0909000${100 + i}`,
      passwordHash: PASSWORD_HASH,
      emailVerified: true,
      role: UserRole.enterprise_admin,
      enterpriseId: [ent1, ent2, ent3, ent4, ent5][i].id,
    })),
    skipDuplicates: true,
  });

  const enterpriseAdmins = await prisma.user.findMany({
    where: { role: UserRole.enterprise_admin },
  });

  // -- MOA (MOU) -------------------------------------------------------------
  console.log('🤝 Seeding MOAs...');

  const mou1 = await prisma.moa.create({
    data: {
      code: 'MOU/2025/001',
      schoolId: school1.id,
      enterpriseId: ent1.id,
      title: 'Hợp tác đào tạo CNTT - Viettel',
      scope: 'Đào tạo thực tập chung trong lĩnh vực công nghệ thông tin và an ninh mạng cho sinh viên trường TC-HCM-001',
      content: 'Viettel đồng ý tiếp nhận và đào tạo thực tập cho sinh viên CNTT với hai đợt/năm.',
      terms: { maxInternsPerYear: 50, durationMonths: 3, feePerLearner: 0, priorityHireRate: 0.6 },
      signedDate: new Date('2025-03-15'),
      expiresDate: new Date('2030-03-15'),
      status: MoaStatus.active,
      createdById: superAdmin.id,
      approvedById: superAdmin.id,
      approvedAt: new Date('2025-03-15'),
    },
  });

  const mou2 = await prisma.moa.create({
    data: {
      code: 'MOU/2025/002',
      schoolId: school2.id,
      enterpriseId: ent3.id,
      title: 'Chương trình bán dẫn Samsung - CDHN',
      scope: 'Đào tạo kỹ thuật viên sản xuất và QA/QC trong ngành bán dẫn.',
      terms: { maxInternsPerYear: 80, durationMonths: 4, feePerLearner: 0, certificationProvided: true },
      signedDate: new Date('2025-04-01'),
      expiresDate: new Date('2030-04-01'),
      signedDocUrl: 'https://r2.linkededu.vn/docs/mou/2025/mou-2025-002-signed.pdf',
      signedDocHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      status: MoaStatus.signed,
      createdById: superAdmin.id,
    },
  });

  const mou3 = await prisma.moa.create({
    data: {
      code: 'MOU/2025/003',
      schoolId: school3.id,
      enterpriseId: ent4.id,
      title: 'Thực tập Y khoa – Bệnh viện Vinmec',
      scope: 'Thực hành lâm sàng và hành chính y tế cho sinh viên y, điều dưỡng.',
      terms: { maxInternsPerYear: 30, durationMonths: 6, feePerLearner: 5000000 },
      signedDate: new Date('2025-05-20'),
      expiresDate: new Date('2028-05-20'),
      status: MoaStatus.active,
      createdById: superAdmin.id,
      approvedById: superAdmin.id,
      approvedAt: new Date('2025-05-20'),
    },
  });

  const mou4 = await prisma.moa.create({
    data: {
      code: 'MOU/2025/004',
      schoolId: school1.id,
      enterpriseId: ent2.id,
      title: 'Logistics Training Partnership – Vinalines',
      scope: 'Đào tạo thực tập logistics và quản lý vận tải biển.',
      terms: { maxInternsPerYear: 40, durationMonths: 3 },
      signedDate: new Date('2025-06-01'),
      expiresDate: new Date('2028-06-01'),
      status: MoaStatus.approved,
      createdById: superAdmin.id,
      approvedById: superAdmin.id,
      approvedAt: new Date('2025-06-01'),
    },
  });

  const mou5 = await prisma.moa.create({
    data: {
      code: 'MOU/2025/005',
      schoolId: school2.id,
      enterpriseId: ent1.id,
      title: 'An ninh mạng Viettel - CDHN',
      scope: 'Chương trình đào tạo chuyên sâu về cybersecurity cho sinh viên CD công nghệ.',
      terms: { maxInternsPerYear: 35, durationMonths: 4 },
      status: MoaStatus.draft,
      createdById: enterpriseAdmins[0]?.id ?? superAdmin.id,
    },
  });

  // -- Programs (CTĐT) --------------------------------------------------------
  console.log('📚 Seeding programs (CTĐT)...');
  const programCreator = schoolAdmins[0]?.id ?? superAdmin.id;

  const programs = await Promise.all([
    prisma.program.create({
      data: {
        code: 'CTDT/2025/001',
        schoolId: school1.id,
        enterpriseId: ent1.id,
        moaId: mou1.id,
        name: 'Thực tập chung CNTT - Viettel 2025',
        programType: ProgramType.thuc_tap_chung,
        field: 'IT',
        qualificationLevel: QualificationLevel.trung_cap,
        durationMonths: 3,
        maxLearners: 50,
        enrolledCount: 15,
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-10-01'),
        applicationDeadline: new Date('2025-06-15'),
        tuitionFeeVnd: 0,
        description: 'Chương trình thực tập chung tại Viettel cho sinh viên CNTT của TC-HCM-001.',
        requirements: {
          minGpa: 2.5,
          majorIn: ['Công nghệ thông tin', 'An ninh mạng'],
          yearOfStudy: [2, 3],
        },
        curriculum: {
          modules: [
            { name: 'Mạng máy tính căn bản', weeks: 2, hours: 60 },
            { name: 'An ninh mạng cơ bản', weeks: 2, hours: 60 },
            { name: 'DevOps essentials', weeks: 2, hours: 60 },
          ],
        },
        status: ProgramStatus.active,
        createdById: programCreator,
        approvedById: programCreator,
        approvedAt: new Date('2025-06-01'),
      },
    }),
    prisma.program.create({
      data: {
        code: 'CTDT/2025/002',
        schoolId: school2.id,
        enterpriseId: ent3.id,
        moaId: mou2.id,
        name: 'Kỹ thuật sản xuất bán dẫn',
        programType: ProgramType.thuc_tap,
        field: 'Semiconductor',
        qualificationLevel: QualificationLevel.cao_dang,
        durationMonths: 4,
        maxLearners: 40,
        enrolledCount: 20,
        startDate: new Date('2025-08-01'),
        endDate: new Date('2025-12-01'),
        applicationDeadline: new Date('2025-07-15'),
        tuitionFeeVnd: 15000000,
        description: 'Đào tạo kỹ thuật viên QA/QC và sản xuất chip tại nhà máy Samsung.',
        requirements: {
          minGpa: 2.8,
          majorIn: ['Điện tử', 'Cơ khí chính xác'],
          minAge: 18,
        },
        curriculum: {
          modules: [
            { name: 'Cơ bản wafer fabrication', weeks: 4, hours: 120 },
            { name: 'QA/QC实操', weeks: 4, hours: 120 },
          ],
        },
        status: ProgramStatus.active,
        createdById: programCreator,
        approvedById: programCreator,
        approvedAt: new Date('2025-06-20'),
      },
    }),
    prisma.program.create({
      data: {
        code: 'CTDT/2025/003',
        schoolId: school3.id,
        enterpriseId: ent4.id,
        moaId: mou3.id,
        name: 'Thực tập điều dưỡng Vinmec',
        programType: ProgramType.thuc_tap,
        field: ProgramField.Healthcare,
        qualificationLevel: QualificationLevel.cao_dang,
        durationMonths: 6,
        maxLearners: 30,
        enrolledCount: 10,
        startDate: new Date('2025-09-01'),
        endDate: new Date('2026-03-01'),
        applicationDeadline: new Date('2025-08-15'),
        tuitionFeeVnd: 5000000,
        description: 'Thực hành lâm sàng tại hệ thống Vinmec cho sinh viên điều dưỡng.',
        requirements: {
          minGpa: 3.0,
          majorIn: ['Điều dưỡng', 'Y đa khoa'],
        },
        status: ProgramStatus.active,
        createdById: programCreator,
        approvedById: programCreator,
        approvedAt: new Date('2025-07-01'),
      },
    }),
    prisma.program.create({
      data: {
        code: 'CTDT/2025/004',
        schoolId: school1.id,
        enterpriseId: ent2.id,
        moaId: mou4.id,
        name: 'Logistics & Vận tải biển',
        programType: ProgramType.thuc_tap_chung,
        field: ProgramField.Logistics,
        qualificationLevel: QualificationLevel.trung_cap,
        durationMonths: 3,
        maxLearners: 40,
        enrolledCount: 5,
        startDate: new Date('2025-10-01'),
        endDate: new Date('2026-01-01'),
        applicationDeadline: new Date('2025-09-15'),
        tuitionFeeVnd: 0,
        description: 'Đào tạo thực tập logistics và quản lý vận tải biển tại Vinalines.',
        requirements: {},
        status: ProgramStatus.pending,
        createdById: programCreator,
      },
    }),
  ]);

  // Fix: the TypeScript parser flagged my strings — let me use valid enum values
  // Recreate those two programs with correct enum string literal matching
  // (Prisma enum values ARE the string identifiers defined in the schema)

  // -- Learners ---------------------------------------------------------------
  console.log('🎓 Seeding learners...');

  // National IDs (fake CCCD — NOT real, for demo only)
  // Format: 3 digits province + 6 digits YYYYMM + 4 digits sequence
  const FAKE_CCCD = [
    '079201000001', '023201000002', '048201000003', '079201000004',
    '001201000005', '048201000006', '079201000007', '001201000008',
    '003201000009', '079201000010', '001201000011', '048201000012',
    '002201000013', '079201000014', '001201000015', '003201000016',
    '048201000017', '079201000018', '001201000019', '079201000020',
  ];

  const learnerSchools = [
    school1, school1, school1, school1, school1,   // 5 — TC-HCM
    school2, school2, school2, school2, school2,   // 5 — CD-HN
    school3, school3, school3, school3, school3,   // 5 — DH-DN
    school1, school1,                               // 2 — TC-HCM
    school2, school2,                               // 2 — CD-HN
  ];

  const learners = [];
  for (let i = 0; i < LEARNER_NAMES.length; i++) {
    const parts = LEARNER_NAMES[i].split(' ');
    const lastName = parts[0];
    const middleName = parts[1] ?? '';
    const firstName = parts.slice(2).join(' ');
    const school = learnerSchools[i];
    const prov = ['79', '79', '48', '79', '79', '01', '01', '01', '01', '79',
      '01', '01', '48', '02', '01', '01', '48', '04', '79', '79'][i];

    const l = await prisma.learner.create({
      data: {
        nationalId: FAKE_CCCD[i],   // ⚠️ MUST encrypt AES-256-GCM at app layer
        fullName: LEARNER_NAMES[i],
        birthDate: new Date(2002 + (i % 5), (i % 12), 1 + (i % 28)),
        gender: i % 3 === 0 ? LearnerGender.nu : i % 5 === 0 ? LearnerGender.khac : LearnerGender.nam,
        address: `${100 + i} Đường ABC, Phường XYZ`,
        provinceCode: prov,
        phone: `0912${String(100000 + i * 1111).slice(0, 7)}`,
        email: `learner${i + 1}@linkededu.vn`,
        schoolId: school.id,
        schoolCode: school.code,
        schoolMajor: ['CNTT', 'An ninh mạng', 'Điều dưỡng', 'Logistics', 'Điện tử'][i % 5],
        graduationYear: 2025 + (i % 3),
        gpa: 6.5 + (i % 30) * 0.1,
        skills: [
          ['JavaScript', 'React'],
          ['Kế toán', 'Excel'],
          ['Python', 'AI basics'],
          ['Điều dưỡng cơ bản'],
          ['Vận tải biển', 'Incoterms'],
          ['Sản xuất bán dẫn'],
          ['QA/QC'][i % 3],
        ][i % 7] ?? ['Kỹ năng mềm'],
        certifications: {
          certifications: [
            { name: 'IELTS ' + (5.5 + (i % 3) * 0.5), issuer: 'British Council', date: '2024-06-01' },
          ],
        },
        status: i < 16 ? LearnerStatus.active : LearnerStatus.graduated,
      },
    });
    learners.push(l);
  }

  // Supplementary learners to hit 20 (already 20 above, but just incase)
  // -- User accounts for learners --------------------------------------------
  for (let i = 0; i < Math.min(10, learners.length); i++) {
    const l = learners[i];
    await prisma.user.upsert({
      where: { email: l.email! },
      create: {
        email: l.email,
        phone: l.phone,
        passwordHash: PASSWORD_HASH,
        emailVerified: i % 2 === 0,
        role: UserRole.learner,
        schoolId: l.schoolId,
        firstName: l.fullName.split(' ').slice(-1)[0],
        lastName: l.fullName.split(' ').slice(0, -1).join(' '),
      },
      update: { userId: l.id },
    });
    // update learner userId
    await prisma.learner.update({
      where: { id: l.id },
      data: { userId: (await prisma.user.findFirst({ where: { email: l.email } }))!.id },
    });
  }

  // -- Enrollments ------------------------------------------------------------
  console.log('📝 Seeding enrollments...');

  const enrollments: { id: string; enrollmentNo: string; learnerId: string }[] = [];
  const ENR_TYPES: EnrollmentType[] = [
    EnrollmentType.self_apply,
    EnrollmentType.staff_created,
    EnrollmentType.enterprise_nominated,
  ];

  for (let i = 0; i < 5; i++) {
    const e = await prisma.enrollment.create({
      data: {
        enrollmentNo: `ENR/2025/${String(i + 1).padStart(3, '0')}`,
        programId: programs[i % programs.length].id,
        learnerId: learners[i].id,
        enrolledById: superAdmin.id,
        enrollmentType: ENR_TYPES[i % 3],
        examScore: [7, 8, 6.5, 9, 7.5][i],
        examDate: new Date('2025-06-15'),
        examNotes: { comment: 'Đạt yêu cầu', assessor: 'Phòng Đào tạo' } as any,
        enrolledAt: recent(30 + i * 10),
        practiceStart: new Date('2025-07-01'),
        practiceEnd: new Date('2025-10-01'),
        status: [EnrollmentStatus.approved, EnrollmentStatus.completed, EnrollmentStatus.pending][i % 3],
        approvedById: superAdmin.id,
        approvedAt: new Date('2025-06-10'),
      },
    });
    enrollments.push({ id: e.id, enrollmentNo: e.enrollmentNo, learnerId: e.learnerId });
  }

  // Enroll remaining 25 learners sequentially with quality output
  for (let i = 5; i < 30; i++) {
    const e = await prisma.enrollment.create({
      data: {
        enrollmentNo: `ENR/2025/${String(i + 1).padStart(3, '0')}`,
        programId: programs[i % programs.length].id,
        learnerId: learners[i % learners.length].id,
        enrollmentType: ENR_TYPES[i % 3],
        status: [
          EnrollmentStatus.pending,
          EnrollmentStatus.approved,
          EnrollmentStatus.completed,
          EnrollmentStatus.rejected,
          EnrollmentStatus.withdrawn,
        ][i % 5],
        enrolledAt: recent(60 + i * 5),
        practiceStart: i % 3 === 0 ? new Date('2025-09-01') : new Date('2025-07-01'),
        practiceEnd: i % 3 === 0 ? new Date('2025-12-01') : new Date('2025-10-01'),
        enrolledById: superAdmin.id,
        examScore: 5 + (i % 25) / 10,
        examDate: new Date('2025-06-20'),
      },
    });
    enrollments.push({ id: e.id, enrollmentNo: e.enrollmentNo, learnerId: e.learnerId });
  }

  // -- Placements -------------------------------------------------------------
  console.log('💼 Seeding placements...');

  // Use first 8 enrollments deterministically for reproducibility
  const placementEnrollments = enrollments.slice(0, 8);
  for (let i = 0; i < placementEnrollments.length; i++) {
    const enroll = placementEnrollments[i];
    const entIdx = i % 5;
    await prisma.placement.create({
      data: {
        enrollmentId: enroll.id,
        learnerId: enroll.learnerId,
        programId: programs[i % programs.length].id,
        enterpriseId: [ent1.id, ent2.id, ent3.id, ent4.id, ent5.id][entIdx],
        positionApplied: ['Kỹ sư CNTT', 'Chuyên viên logistics', 'Kỹ thuật viên QC', 'Điều dưỡng', 'QA Engineer'][entIdx],
        positionOffered: ['Junior Developer', 'Logistics Coordinator', 'QA', 'Nurse', 'QA Engineer'][entIdx],
        employmentType: EmploymentType.internship,
        salaryMinVnd: 4000000,
        salaryMaxVnd: 8000000,
        acceptedAt: new Date('2025-10-01'),
        startDate: new Date('2025-10-15'),
        endDate: new Date('2026-04-15'),
        tracking3mStatus: i >= 4 ? 'completed_nhan_vien' : 'on_track',
        tracking3mDate: i >= 4 ? new Date('2026-01-15') : new Date('2026-01-15'),
        tracking3mNotes: 'Làm việc tốt, hiểu quy trình nhanh.',
        tracking6mStatus: i >= 6 ? 'completed' : 'in_progress',
        tracking6mDate: i >= 6 ? new Date('2026-04-15') : undefined,
        tracking6mNotes: i >= 6 ? 'Đã ký hợp đồng chính thức.' : undefined,
        learnerSatisfaction: 4 + (i % 2),
        enterpriseSatisfaction: 4 + (i % 2),
        learnerFeedback: 'Rất hài lòng với chương trình thực tập.',
        enterpriseFeedback: 'Sinh viên có thái độ tốt, học nhanh.',
        isCurrentJob: i >= 6,
        status: PlacementStatus.in_progress,
      },
    });
  }

  // -- Practice Records (sample) ----------------------------------------------
  console.log('📋 Seeding practice records...');
  const sampleEnrollments = await prisma.enrollment.findMany({
    take: 5,
    select: { id: true, learnerId: true },
  });

  const supervisorId = enterpriseAdmins[0]?.id ?? superAdmin.id;
  for (const enroll of sampleEnrollments.slice(0, 5)) {
    await prisma.practiceRecord.create({
      data: {
        enrollmentId: enroll.id,
        learnerId: enroll.learnerId,
        enterpriseId: ent1.id,
        practiceDate: new Date(),
        activities: 'Hỗ trợ kiểm thử tự động hóa, viết unit test cho API.',
        hoursWorked: 8,
        supervisorName: 'Mr. Phạm Minh Đức',
        skillsDemonstrated: ['Python', 'pytest', 'Git'],
        feedback: 'Làm việc tốt, cần cải thiện tốc độ.',
        rating: 4,
        createdById: supervisorId,
      },
    });
  }

  // -- Evaluations (sample) --------------------------------------------------
  console.log('📊 Seeding evaluations...');
  for (const enroll of sampleEnrollments.slice(0, 3)) {
    await prisma.evaluation.create({
      data: {
        enrollmentId: enroll.id,
        evaluatorId: superAdmin.id,
        evaluationType: EvaluationType.final,
        totalScore: 7,
        maxScore: 10,
        percentage: 70,
        rubric: {
          criteria: [
            { name: 'Kỹ năng chuyên môn', score: 8 },
            { name: 'Kỹ năng mềm', score: 7 },
            { name: 'Thái độ', score: 9 },
          ],
        },
        feedback: 'Sinh viên làm việc tốt, cần cải thiện giao tiếp.',
        strengths: ['Chuyên môn tốt', 'Tự học nhanh'],
        improvements: ['Presentation skill', 'Tiếng Anh'],
      },
    });
  }

  // -- Invoices ---------------------------------------------------------------
  console.log('💰 Seeding invoices...');
  await prisma.invoice.createMany({
    data: [
      {
        invoiceNumber: 'INV/2025/001',
        schoolId: school2.id,
        amountVnd: 15000000,
        taxAmountVnd: 1500000,
        totalVnd: 16500000,
        issueDate: new Date('2025-07-01'),
        dueDate: new Date('2025-08-01'),
        status: InvoiceStatus.issued,
        paymentMethod: PaymentMethod.bank_transfer,
        paymentReference: 'CK20250701001',
        invoiceItems: [{ programCode: 'CTDT/2025/002', description: 'Học phí Kỹ thuật sản xuất bán dẫn', quantity: 1, unitPrice: 15000000 }],
        relatedEntityType: 'program',
        relatedEntityId: String(programs[1].id),
        issuedById: superAdmin.id,
        createdAt: new Date('2025-07-01'),
      },
      {
        invoiceNumber: 'INV/2025/002',
        schoolId: school3.id,
        amountVnd: 5000000,
        taxAmountVnd: 500000,
        totalVnd: 5500000,
        issueDate: new Date('2025-06-15'),
        dueDate: new Date('2025-07-15'),
        paidDate: new Date('2025-07-10'),
        status: InvoiceStatus.paid,
        paymentMethod: PaymentMethod.vnpay,
        paymentReference: 'VNPAY20250615ABC',
        invoiceItems: [{ programCode: 'CTDT/2025/003', description: 'Học phí thực tập điều dưỡng', quantity: 1, unitPrice: 5000000 }],
        relatedEntityType: 'program',
        relatedEntityId: String(programs[2].id),
        issuedById: superAdmin.id,
        createdAt: new Date('2025-06-15'),
      },
    ],
    skipDuplicates: true,
  });

  console.log('\n✅ Seed complete!');
}

// =============================================================================
// Run
// =============================================================================

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
