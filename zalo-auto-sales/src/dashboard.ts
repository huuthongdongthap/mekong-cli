// Dashboard HTML — single source of truth
// Inlined at runtime because Cloudflare Workers cannot read filesystem.

export const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zalo Auto Sales</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <style>
    [x-cloak]{display:none!important}
    body{font-family:system-ui,-apple-system,sans-serif}
    .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:600}
  </style>
</head>
<body class="bg-gray-50 min-h-screen" x-data="app()" x-init="init()" x-cloak>

<!-- ── Topbar ── -->
<header class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
  <div class="flex items-center gap-2">
    <div class="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">Z</div>
    <span class="font-semibold text-gray-900 text-sm">Zalo Auto Sales</span>
  </div>
  <div class="flex items-center gap-3">
    <!-- OA Switcher -->
    <template x-if="oaList.length > 0">
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-400">OA:</span>
        <select x-model="selectedOaId" @change="onOaChange()"
          class="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400">
          <option value="">Tất cả</option>
          <template x-for="oa in oaList" :key="oa.id">
            <option :value="oa.id" x-text="oa.display_name || oa.oa_id || oa.id"></option>
          </template>
        </select>
        <span class="text-xs" :class="selectedOaStatus?.is_expiring_soon ? 'text-orange-500' : 'text-green-600'"
          x-text="selectedOaStatus ? (selectedOaStatus.is_expiring_soon ? '⚠' : '●') : ''"></span>
      </div>
    </template>
    <template x-if="oaList.length === 0">
      <span class="text-xs" :class="status.configured ? 'text-green-600' : 'text-orange-500'"
        x-text="status.configured ? '● OA: ' + (status.oa_id||'?') : '● Chưa kết nối'"></span>
    </template>
    <a href="/login" class="text-xs text-blue-600 hover:underline">⚙ Setup</a>
  </div>
</header>

<!-- ── Tab Nav ── -->
<nav class="bg-white border-b border-gray-200 px-6 flex gap-1 sticky top-12 z-10">
  <template x-for="tab in tabs" :key="tab.id">
    <button @click="switchTab(tab.id)"
      class="px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px"
      :class="activeTab===tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'">
      <span x-text="tab.label"></span>
    </button>
  </template>
</nav>

<main class="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

<!-- ════════════════════════════════════════════
     TAB: DASHBOARD
════════════════════════════════════════════ -->
<div x-show="activeTab==='dashboard'" x-transition>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <p class="text-xs text-gray-500 mb-1">OA Token</p>
      <template x-if="status.configured">
        <div>
          <p class="font-semibold text-sm truncate" x-text="status.app_id"></p>
          <p class="text-xs mt-1" :class="status.is_expiring_soon?'text-orange-500':'text-green-600'"
            x-text="status.is_expiring_soon?'⚠ Sắp hết hạn':'✓ Còn hạn'"></p>
        </div>
      </template>
      <template x-if="!status.configured">
        <p class="text-sm text-orange-500 font-medium">Chưa kết nối</p>
      </template>
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <p class="text-xs text-gray-500 mb-1">Sequences</p>
      <p class="text-2xl font-bold text-gray-900" x-text="sequences.length"></p>
      <p class="text-xs text-gray-400 mt-1" x-text="sequences.filter(s=>s.is_active).length + ' active'"></p>
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <p class="text-xs text-gray-500 mb-1">Contacts</p>
      <p class="text-2xl font-bold text-gray-900" x-text="contactsMeta.total||0"></p>
      <p class="text-xs text-gray-400 mt-1" x-text="contacts.filter(c=>c.is_following).length+' following'"></p>
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <p class="text-xs text-gray-500 mb-1">Hôm nay</p>
      <p class="text-2xl font-bold text-gray-900" x-text="(analytics.funnel?.messages_sent_today)||0"></p>
      <p class="text-xs text-gray-400 mt-1">tin nhắn đã gửi</p>
    </div>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <p class="text-sm font-semibold text-gray-700 mb-3">Active Enrollments mới nhất</p>
      <div class="space-y-2">
        <template x-for="e in enrollments.slice(0,5)" :key="e.id">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-700 truncate" x-text="e.display_name||e.zalo_user_id"></span>
            <span class="text-xs text-gray-400 shrink-0 ml-2" x-text="(e.sequence_name||'').slice(0,20)"></span>
          </div>
        </template>
        <p x-show="enrollments.length===0" class="text-xs text-gray-400">Không có dữ liệu</p>
      </div>
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <p class="text-sm font-semibold text-gray-700 mb-3">Thống kê tổng hợp</p>
      <div class="space-y-2">
        <div class="flex justify-between text-sm"><span class="text-gray-500">Tổng gửi thành công</span><span class="font-semibold text-green-600" x-text="analytics.funnel?.total_sent||0"></span></div>
        <div class="flex justify-between text-sm"><span class="text-gray-500">Gửi thất bại hôm nay</span><span class="font-semibold text-red-500" x-text="analytics.funnel?.messages_failed_today||0"></span></div>
        <div class="flex justify-between text-sm"><span class="text-gray-500">Tổng chi phí</span><span class="font-semibold text-gray-700" x-text="(analytics.cost?.total_cost_vnd||0).toLocaleString('vi-VN') + 'đ'"></span></div>
      </div>
    </div>
  </div>
</div>

<!-- ════════════════════════════════════════════
     TAB: SEQUENCES
════════════════════════════════════════════ -->
<div x-show="activeTab==='sequences'" x-transition>

  <!-- Create form toggle -->
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Sequences</h2>
    <button @click="showNewSeqForm=!showNewSeqForm"
      class="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">+ Tạo mới</button>
  </div>

  <!-- New Sequence Form -->
  <div x-show="showNewSeqForm" class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1">Tên *</label>
        <input x-model="newSeq.name" type="text" placeholder="VD: Chăm sóc sau follow"
          class="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1">Trigger</label>
        <select x-model="newSeq.trigger_event" class="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
          <option value="manual">Manual</option>
          <option value="follow">Follow OA</option>
          <option value="keyword">Keyword</option>
        </select>
      </div>
      <div x-show="newSeq.trigger_event==='keyword'">
        <label class="block text-xs font-medium text-gray-700 mb-1">Keyword</label>
        <input x-model="newSeq.trigger_keyword" type="text" placeholder="VD: mua hàng"
          class="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
      </div>
      <div :class="newSeq.trigger_event==='keyword'?'':'sm:col-span-2'">
        <label class="block text-xs font-medium text-gray-700 mb-1">Mô tả</label>
        <input x-model="newSeq.description" type="text"
          class="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
      </div>
    </div>
    <div class="flex gap-2 mt-3">
      <button @click="createSequence()" class="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700">Tạo</button>
      <button @click="showNewSeqForm=false" class="text-xs border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg hover:bg-gray-50">Huỷ</button>
    </div>
  </div>

  <!-- Sequence list -->
  <div class="space-y-2">
    <template x-for="seq in sequences" :key="seq.id">
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <!-- Sequence row -->
        <div class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
          @click="toggleSeqExpand(seq.id)">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium text-sm text-gray-900" x-text="seq.name"></span>
              <span class="badge" :class="seq.is_active?'bg-green-100 text-green-800':'bg-gray-100 text-gray-500'"
                x-text="seq.is_active?'Active':'Off'"></span>
              <span class="badge bg-blue-50 text-blue-700" x-text="seq.trigger_event"></span>
              <span x-show="seq.trigger_keyword" class="text-xs text-blue-500" x-text="'#'+seq.trigger_keyword"></span>
            </div>
            <p class="text-xs text-gray-400 mt-0.5" x-text="seq.description||''"></p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button @click.stop="toggleSequence(seq)"
              class="text-xs px-2 py-1 rounded border"
              :class="seq.is_active?'border-orange-200 text-orange-600 hover:bg-orange-50':'border-green-200 text-green-600 hover:bg-green-50'"
              x-text="seq.is_active?'Tắt':'Bật'"></button>
            <svg class="w-4 h-4 text-gray-400 transition-transform"
              :class="expandedSeqId===seq.id?'rotate-180':''"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>

        <!-- Expanded: steps panel -->
        <div x-show="expandedSeqId===seq.id" x-transition class="border-t border-gray-100 bg-gray-50 px-4 py-3">
          <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Các bước</p>

          <!-- Steps list -->
          <div class="space-y-2 mb-3">
            <template x-for="step in (seqSteps[seq.id]||[])" :key="step.id">
              <div class="bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <div class="flex items-start gap-2">
                  <span class="badge bg-gray-100 text-gray-600 shrink-0" x-text="'Bước ' + step.step_order"></span>
                  <span class="badge bg-purple-50 text-purple-700 shrink-0" x-text="step.message_type"></span>
                  <span class="badge bg-yellow-50 text-yellow-700 shrink-0" x-text="formatDelay(step.delay_minutes)"></span>
                  <span class="text-gray-700 text-xs flex-1 line-clamp-2" x-text="step.message_content"></span>
                </div>
              </div>
            </template>
            <p x-show="(seqSteps[seq.id]||[]).length===0" class="text-xs text-gray-400 italic">Chưa có bước nào.</p>
          </div>

          <!-- Add step toggle -->
          <button @click="addingStepFor = addingStepFor===seq.id ? null : seq.id; newStep={delay_minutes:0,message_type:'text',message_content:'',template_id:''}"
            class="text-xs text-blue-600 hover:underline mb-2">+ Thêm bước</button>

          <!-- Add step form -->
          <div x-show="addingStepFor===seq.id" class="bg-white rounded-lg border border-blue-200 p-3 mt-2 space-y-2">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Delay (phút)</label>
                <input x-model.number="newStep.delay_minutes" type="number" min="0"
                  class="w-full border border-gray-300 rounded px-2 py-1 text-xs">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Loại</label>
                <select x-model="newStep.message_type" class="w-full border border-gray-300 rounded px-2 py-1 text-xs">
                  <option value="text">Text</option>
                  <option value="template">Template ZBS</option>
                  <option value="image">Image</option>
                </select>
              </div>
            </div>
            <div x-show="newStep.message_type==='template'">
              <label class="block text-xs font-medium text-gray-600 mb-1">Template ID</label>
              <input x-model="newStep.template_id" type="text" placeholder="ID từ Zalo ZBS"
                class="w-full border border-gray-300 rounded px-2 py-1 text-xs">
            </div>
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-medium text-gray-600">Nội dung</label>
                <!-- Insert var dropdown -->
                <div class="relative" x-data="{open:false}">
                  <button @click="open=!open" class="text-xs text-blue-500 hover:underline">⊞ Chèn biến ▾</button>
                  <div x-show="open" @click.outside="open=false"
                    class="absolute right-0 top-5 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-[160px]">
                    <template x-for="v in templateVars" :key="v">
                      <button @click="newStep.message_content += v; open=false"
                        class="block w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 font-mono"
                        x-text="v"></button>
                    </template>
                  </div>
                </div>
              </div>
              <textarea x-model="newStep.message_content" rows="3" placeholder="Nội dung tin nhắn... dùng {{display_name}} để chèn biến"
                class="w-full border border-gray-300 rounded px-2 py-1 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
            </div>

            <!-- Preview row -->
            <div x-show="newStep.message_content" class="flex items-start gap-2">
              <button @click="previewStep(seq.id)"
                class="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-1 rounded hover:bg-purple-100 shrink-0">
                🔍 Preview
              </button>
              <div x-show="previewResult[seq.id]" class="bg-green-50 border border-green-200 rounded px-2 py-1 text-xs text-green-800 flex-1"
                x-text="previewResult[seq.id]"></div>
            </div>

            <div class="flex gap-2 pt-1">
              <button @click="addStep(seq.id)"
                class="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Lưu bước</button>
              <button @click="addingStepFor=null"
                class="text-xs border border-gray-300 text-gray-500 px-3 py-1 rounded hover:bg-gray-50">Huỷ</button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <p x-show="sequences.length===0&&!loading" class="text-center text-sm text-gray-400 py-8">Chưa có sequence nào.</p>
  </div>
</div>

<!-- ════════════════════════════════════════════
     TAB: CONTACTS
════════════════════════════════════════════ -->
<div x-show="activeTab==='contacts'" x-transition>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">
      Contacts <span class="font-normal normal-case ml-1 text-gray-400" x-text="'('+(contactsMeta.total||0)+')'"></span>
    </h2>
  </div>

  <div class="space-y-2">
    <template x-for="contact in contacts" :key="contact.id">
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <!-- Contact row -->
        <div class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
          @click="toggleContactExpand(contact)">
          <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs shrink-0"
            x-text="(contact.display_name||'?')[0].toUpperCase()"></div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium text-sm text-gray-900" x-text="contact.display_name||'(Chưa có tên)'"></span>
              <span class="badge" :class="contact.is_following?'bg-green-100 text-green-800':'bg-gray-100 text-gray-500'"
                x-text="contact.is_following?'Following':'Unfollow'"></span>
            </div>
            <p class="text-xs text-gray-400 font-mono" x-text="contact.zalo_user_id"></p>
          </div>
          <div class="text-xs text-gray-400 shrink-0">
            <span x-text="contact.last_interaction_at ? (contact.last_interaction_at.slice(0,10)) : '—'"></span>
          </div>
          <svg class="w-4 h-4 text-gray-400 transition-transform shrink-0"
            :class="expandedContactId===contact.id?'rotate-180':''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>

        <!-- Expanded: detail panel -->
        <div x-show="expandedContactId===contact.id" x-transition class="border-t border-gray-100 bg-gray-50 px-4 py-4 space-y-4">

          <!-- Basic info -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div><p class="text-gray-400 mb-0.5">Zalo ID</p><p class="font-mono text-gray-700" x-text="contact.zalo_user_id"></p></div>
            <div><p class="text-gray-400 mb-0.5">SĐT</p><p class="text-gray-700" x-text="contact.phone||'—'"></p></div>
            <div><p class="text-gray-400 mb-0.5">Follow lúc</p><p class="text-gray-700" x-text="(contact.followed_at||'—').slice(0,10)"></p></div>
            <div><p class="text-gray-400 mb-0.5">Tương tác cuối</p><p class="text-gray-700" x-text="(contact.last_interaction_at||'—').slice(0,16).replace('T',' ')"></p></div>
          </div>

          <!-- Custom Fields -->
          <div>
            <p class="text-xs font-semibold text-gray-600 mb-2">Custom Fields</p>
            <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table class="w-full text-xs">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="text-left px-3 py-2 text-gray-500 font-medium">Key</th>
                    <th class="text-left px-3 py-2 text-gray-500 font-medium">Value</th>
                    <th class="px-3 py-2 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  <template x-for="meta in (contactMetadata[contact.id]||[])" :key="meta.id">
                    <tr class="border-t border-gray-100">
                      <td class="px-3 py-2 font-mono text-gray-700" x-text="meta.field_key"></td>
                      <td class="px-3 py-2 text-gray-600" x-text="meta.field_value||'—'"></td>
                      <td class="px-3 py-2 text-right">
                        <button @click="deleteMeta(contact.id, meta.field_key)"
                          class="text-red-400 hover:text-red-600">✕</button>
                      </td>
                    </tr>
                  </template>
                  <!-- Add row -->
                  <tr class="border-t border-blue-100 bg-blue-50">
                    <td class="px-3 py-2">
                      <input x-model="newMeta[contact.id+'.key']" type="text" placeholder="field_key"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-400">
                    </td>
                    <td class="px-3 py-2">
                      <input x-model="newMeta[contact.id+'.val']" type="text" placeholder="value"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-400">
                    </td>
                    <td class="px-3 py-2 text-right">
                      <button @click="addMeta(contact.id)"
                        class="text-blue-600 hover:text-blue-800 font-bold text-sm">+</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Test Send -->
          <div>
            <p class="text-xs font-semibold text-gray-600 mb-2">Gửi test</p>
            <div class="flex gap-2">
              <div class="flex-1 relative">
                <textarea x-model="testMsg[contact.id]" rows="2"
                  placeholder="Nhập nội dung... {{display_name}} được hỗ trợ"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div class="flex flex-col gap-1">
                <button @click="testSend(contact)"
                  class="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 whitespace-nowrap">Gửi ▶</button>
              </div>
            </div>
            <div x-show="testResult[contact.id]" class="mt-2 text-xs rounded-lg px-3 py-2"
              :class="testResult[contact.id]?.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'"
              x-text="testResult[contact.id]?.msg"></div>
          </div>
        </div>
      </div>
    </template>
    <p x-show="contacts.length===0&&!loading" class="text-center text-sm text-gray-400 py-8">Chưa có contact nào.</p>
  </div>

  <!-- Pagination -->
  <div class="flex items-center justify-between mt-4" x-show="contactsMeta.total>0">
    <p class="text-xs text-gray-500" x-text="'Hiển thị '+contacts.length+' / '+(contactsMeta.total||0)"></p>
    <div class="flex gap-2">
      <button @click="if(contactPage>1){contactPage--;loadContacts();}" :disabled="contactPage<=1"
        class="text-xs px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50">← Trước</button>
      <button @click="if(contacts.length===50){contactPage++;loadContacts();}" :disabled="contacts.length<50"
        class="text-xs px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50">Sau →</button>
    </div>
  </div>
</div>

<!-- ════════════════════════════════════════════
     TAB: MESSAGE LOGS
════════════════════════════════════════════ -->
<div x-show="activeTab==='logs'" x-transition>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Message Logs</h2>
    <div class="flex gap-2">
      <template x-for="s in ['','sent','failed']" :key="s">
        <button @click="logsStatus=s; logsPage=1; loadLogs()"
          class="text-xs px-3 py-1.5 rounded-lg border transition-colors"
          :class="logsStatus===s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
          x-text="s===''?'Tất cả':s==='sent'?'Đã gửi':'Thất bại'"></button>
      </template>
    </div>
  </div>

  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <table class="w-full text-sm">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">Contact</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">Nội dung</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">Loại</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">Trạng thái</th>
          <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500">Chi phí</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">Thời gian</th>
        </tr>
      </thead>
      <tbody>
        <template x-for="log in logs" :key="log.id">
          <tr class="border-b border-gray-100 hover:bg-gray-50">
            <td class="px-4 py-3 text-xs font-medium" x-text="log.display_name||log.zalo_user_id||log.contact_id"></td>
            <td class="px-4 py-3 text-xs text-gray-600 max-w-xs">
              <span class="line-clamp-2" x-text="log.message_content||'—'"></span>
            </td>
            <td class="px-4 py-3">
              <span class="badge bg-purple-50 text-purple-700" x-text="log.message_type||'text'"></span>
            </td>
            <td class="px-4 py-3">
              <span class="badge" :class="{
                'bg-green-100 text-green-800':log.status==='sent',
                'bg-blue-100 text-blue-800':log.status==='delivered',
                'bg-red-100 text-red-800':log.status==='failed',
                'bg-gray-100 text-gray-600':log.status==='pending'
              }" x-text="log.status"></span>
            </td>
            <td class="px-4 py-3 text-xs text-right" x-text="log.cost_vnd ? log.cost_vnd+'đ' : '—'"></td>
            <td class="px-4 py-3 text-xs text-gray-400" x-text="(log.sent_at||log.created_at||'—').slice(0,16).replace('T',' ')"></td>
          </tr>
        </template>
        <tr x-show="logs.length===0&&!loading">
          <td colspan="6" class="px-4 py-10 text-center text-sm text-gray-400">Chưa có tin nhắn nào được ghi nhận.</td>
        </tr>
      </tbody>
    </table>
    <div class="flex items-center justify-between px-4 py-3 border-t border-gray-100" x-show="logsMeta.total>0">
      <p class="text-xs text-gray-500" x-text="'Hiển thị '+logs.length+' / '+(logsMeta.total||0)"></p>
      <div class="flex gap-2">
        <button @click="if(logsPage>1){logsPage--;loadLogs();}" :disabled="logsPage<=1"
          class="text-xs px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50">← Trước</button>
        <button @click="if(logs.length===50){logsPage++;loadLogs();}" :disabled="logs.length<50"
          class="text-xs px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50">Sau →</button>
      </div>
    </div>
  </div>
</div>

<!-- ════════════════════════════════════════════
     TAB: ANALYTICS
════════════════════════════════════════════ -->
<div x-show="activeTab==='analytics'" x-transition>

  <!-- Row 1: Overview Cards -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-gray-500">Tổng Contacts</span>
        <span class="text-base">👥</span>
      </div>
      <p class="text-2xl font-bold text-gray-900" x-text="analytics.overview?.total_contacts||0"></p>
      <p class="text-xs text-gray-400 mt-1" x-text="(analytics.overview?.active_followers||0)+' đang follow'"></p>
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-gray-500">Tin nhắn hôm nay</span>
        <span class="text-base">💬</span>
      </div>
      <p class="text-2xl font-bold text-blue-600" x-text="analytics.funnel?.messages_sent_today||0"></p>
      <p class="text-xs text-gray-400 mt-1" x-text="(analytics.funnel?.messages_failed_today||0)+' thất bại'"></p>
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-gray-500">Chi phí 30 ngày</span>
        <span class="text-base">💰</span>
      </div>
      <p class="text-2xl font-bold text-gray-900" x-text="(analytics.cost?.cost_30d||0).toLocaleString('vi-VN')+'đ'"></p>
      <p class="text-xs text-gray-400 mt-1" x-text="'avg '+((analytics.cost?.avg_cost_per_contact||0)).toLocaleString('vi-VN')+'đ/contact'"></p>
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-gray-500">ROI</span>
        <span class="text-base">📈</span>
      </div>
      <p class="text-2xl font-bold" :class="(analytics.conversions?.roi_percentage||0)>=0?'text-green-600':'text-red-500'"
        x-text="(analytics.conversions?.roi_percentage||0)+'%'"></p>
      <p class="text-xs text-gray-400 mt-1" x-text="(analytics.conversions?.revenue_vnd||0).toLocaleString('vi-VN')+'đ doanh thu'"></p>
    </div>
  </div>

  <!-- Row 2: Funnel Visualization -->
  <div class="bg-white rounded-xl border border-gray-200 p-5 mb-6">
    <p class="text-sm font-semibold text-gray-700 mb-4">Funnel chuyển đổi</p>
    <div class="space-y-3">
      <template x-for="step in (function(){
        const f=analytics.funnel||{};
        const steps=[
          {label:'Follow',    count:f.total_follows||0,    color:'bg-blue-500'},
          {label:'Enrolled',  count:f.total_enrolled||0,   color:'bg-indigo-500'},
          {label:'Sent',      count:f.total_sent||0,       color:'bg-violet-500'},
          {label:'Delivered', count:f.total_delivered||0,  color:'bg-purple-500'},
          {label:'Read',      count:f.total_read||0,       color:'bg-pink-500'},
          {label:'Click CTA', count:f.total_click_cta||0,  color:'bg-rose-500'},
          {label:'Convert',   count:f.total_conversions||0,color:'bg-red-500'},
        ];
        const max=steps[0].count||1;
        return steps.map((s,i)=>({...s,pct:Math.round(s.count/max*100),rate:i>0&&steps[i-1].count>0?Math.round(s.count/steps[i-1].count*100)+'%':'—'}));
      }())" :key="step.label">
        <div class="flex items-center gap-3">
          <span class="text-xs text-gray-500 w-20 shrink-0" x-text="step.label"></span>
          <div class="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div class="h-full rounded-full transition-all" :class="step.color" :style="'width:'+step.pct+'%'"></div>
          </div>
          <span class="text-xs font-semibold text-gray-700 w-14 text-right" x-text="step.count.toLocaleString()"></span>
          <span class="text-xs text-gray-400 w-10 text-right" x-text="step.rate"></span>
        </div>
      </template>
    </div>
    <div class="flex gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
      <span>Delivery rate: <strong x-text="(analytics.funnel?.delivery_rate||0)+'%'"></strong></span>
      <span>Read rate: <strong x-text="(analytics.funnel?.read_rate||0)+'%'"></strong></span>
      <span>Conv. rate: <strong x-text="(analytics.conversions?.conversion_rate||0)+'%'"></strong></span>
    </div>
  </div>

  <!-- Row 3: Time-based Stats -->
  <div class="bg-white rounded-xl border border-gray-200 p-5 mb-6">
    <p class="text-sm font-semibold text-gray-700 mb-3">Thống kê theo thời gian</p>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs text-gray-500 border-b border-gray-100">
            <th class="text-left pb-2 font-medium">Chỉ số</th>
            <th class="text-right pb-2 font-medium">Hôm nay</th>
            <th class="text-right pb-2 font-medium">7 ngày</th>
            <th class="text-right pb-2 font-medium">30 ngày</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr>
            <td class="py-2 text-gray-600">Follows mới</td>
            <td class="py-2 text-right font-medium" x-text="analytics.funnel?.follows_today||0"></td>
            <td class="py-2 text-right font-medium" x-text="analytics.funnel?.follows_7d||0"></td>
            <td class="py-2 text-right font-medium" x-text="analytics.funnel?.follows_30d||0"></td>
          </tr>
          <tr>
            <td class="py-2 text-gray-600">Tin nhắn gửi</td>
            <td class="py-2 text-right font-medium" x-text="analytics.funnel?.messages_sent_today||0"></td>
            <td class="py-2 text-right font-medium" x-text="analytics.funnel?.messages_sent_7d||0"></td>
            <td class="py-2 text-right font-medium" x-text="analytics.funnel?.messages_sent_30d||0"></td>
          </tr>
          <tr>
            <td class="py-2 text-gray-600">Chi phí (đ)</td>
            <td class="py-2 text-right font-medium" x-text="(analytics.cost?.cost_today||0).toLocaleString('vi-VN')"></td>
            <td class="py-2 text-right font-medium" x-text="(analytics.cost?.cost_7d||0).toLocaleString('vi-VN')"></td>
            <td class="py-2 text-right font-medium" x-text="(analytics.cost?.cost_30d||0).toLocaleString('vi-VN')"></td>
          </tr>
          <tr>
            <td class="py-2 text-gray-600">Conversions</td>
            <td class="py-2 text-right font-medium" x-text="conversions.filter(cv=>cv.created_at&&cv.created_at.slice(0,10)===new Date().toISOString().slice(0,10)).length"></td>
            <td class="py-2 text-right font-medium">—</td>
            <td class="py-2 text-right font-medium" x-text="analytics.conversions?.total_conversions||0"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Row 4: Top Sequences -->
  <div class="bg-white rounded-xl border border-gray-200 p-5 mb-6" x-show="(analytics.top_sequences||[]).length>0">
    <p class="text-sm font-semibold text-gray-700 mb-3">Top Sequences</p>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs text-gray-500 border-b border-gray-100">
            <th class="text-left pb-2 font-medium">Sequence</th>
            <th class="text-right pb-2 font-medium">Enrolled</th>
            <th class="text-right pb-2 font-medium">Completed</th>
            <th class="text-right pb-2 font-medium">Conv. Rate</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <template x-for="seq in (analytics.top_sequences||[])" :key="seq.name">
            <tr>
              <td class="py-2 text-gray-700 font-medium max-w-xs truncate" x-text="seq.name"></td>
              <td class="py-2 text-right" x-text="seq.enrolled"></td>
              <td class="py-2 text-right" x-text="seq.completed"></td>
              <td class="py-2 text-right font-semibold" :class="seq.conversion_rate>0?'text-green-600':'text-gray-400'"
                x-text="seq.conversion_rate+'%'"></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Conversion Logger -->
  <div class="flex items-center justify-between mb-3">
    <p class="text-sm font-semibold text-gray-700">Lịch sử Conversion</p>
    <button @click="showConvModal=true"
      class="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
      📝 Ghi nhận chuyển đổi
    </button>
  </div>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <table class="w-full text-sm">
      <thead class="bg-gray-50">
        <tr class="text-xs text-gray-500">
          <th class="text-left px-4 py-2 font-medium">Contact</th>
          <th class="text-right px-4 py-2 font-medium">Giá trị (đ)</th>
          <th class="text-left px-4 py-2 font-medium">Ghi chú</th>
          <th class="text-right px-4 py-2 font-medium">Thời gian</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <template x-for="cv in conversions" :key="cv.id">
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-2 text-gray-700" x-text="cv.display_name||cv.contact_id"></td>
            <td class="px-4 py-2 text-right font-semibold text-green-600" x-text="(cv.value_vnd||0).toLocaleString('vi-VN')+'đ'"></td>
            <td class="px-4 py-2 text-gray-500" x-text="cv.notes||'—'"></td>
            <td class="px-4 py-2 text-right text-xs text-gray-400" x-text="(cv.created_at||'').slice(0,10)"></td>
          </tr>
        </template>
        <tr x-show="conversions.length===0">
          <td colspan="4" class="px-4 py-6 text-center text-xs text-gray-400">Chưa có dữ liệu</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Conversion Modal -->
  <div x-show="showConvModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" x-cloak>
    <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" @click.stop>
      <h3 class="text-sm font-semibold text-gray-900 mb-4">📝 Ghi nhận chuyển đổi</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Contact</label>
          <select x-model="newConv.contact_id" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">— Chọn contact —</option>
            <template x-for="ct in contacts" :key="ct.id">
              <option :value="ct.id" x-text="ct.display_name||ct.zalo_user_id||ct.id"></option>
            </template>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Giá trị (VNĐ)</label>
          <input type="number" x-model.number="newConv.value_vnd" placeholder="0"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Ghi chú</label>
          <input type="text" x-model="newConv.notes" placeholder="Mua hàng, đăng ký..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
      </div>
      <div class="flex gap-2 mt-5">
        <button @click="logConversion()"
          class="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Lưu
        </button>
        <button @click="showConvModal=false; newConv={contact_id:'',value_vnd:0,notes:''}"
          class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
          Hủy
        </button>
      </div>
    </div>
  </div>

</div>

<!-- ════════════════════════════════════════════
     TAB: AI
════════════════════════════════════════════ -->
<div x-show="activeTab==='ai'" x-transition>
  <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">AI Auto-Reply</h2>

  <!-- AI Settings -->
  <div class="bg-white rounded-xl border border-gray-200 p-5 mb-4 space-y-4">
    <p class="text-sm font-semibold text-gray-700">Cài đặt AI</p>

    <!-- Toggle -->
    <div class="flex items-center gap-3">
      <label class="text-sm text-gray-600">Bật AI trả lời tự động</label>
      <button @click="aiConfig.enabled=aiConfig.enabled?0:1"
        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
        :class="aiConfig.enabled?'bg-blue-600':'bg-gray-300'">
        <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow"
          :class="aiConfig.enabled?'translate-x-6':'translate-x-1'"></span>
      </button>
    </div>

    <!-- API Key -->
    <div>
      <label class="block text-xs font-medium text-gray-700 mb-1">Google Gemini API Key</label>
      <input x-model="aiConfig.api_key" type="password" placeholder="AIza..."
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>

    <!-- Model -->
    <div>
      <label class="block text-xs font-medium text-gray-700 mb-1">Model</label>
      <select x-model="aiConfig.model" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
        <option value="gemini-2.0-flash">gemini-2.0-flash</option>
        <option value="gemini-1.5-pro">gemini-1.5-pro</option>
      </select>
    </div>

    <!-- System Prompt -->
    <div>
      <label class="block text-xs font-medium text-gray-700 mb-1">System Prompt</label>
      <textarea x-model="aiConfig.system_prompt" rows="4"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
    </div>

    <!-- Temperature -->
    <div>
      <label class="block text-xs font-medium text-gray-700 mb-1">Temperature: <span x-text="aiConfig.temperature"></span></label>
      <input x-model="aiConfig.temperature" type="range" min="0" max="1" step="0.1"
        class="w-full accent-blue-600">
    </div>

    <!-- Escalation Keywords -->
    <div>
      <label class="block text-xs font-medium text-gray-700 mb-1">Escalation Keywords (JSON array)</label>
      <textarea x-model="aiConfig.escalation_keywords" rows="2"
        placeholder='["gặp người", "nhân viên", "hotline", "khiếu nại"]'
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
    </div>

    <!-- Save button -->
    <div class="flex items-center gap-3">
      <button @click="saveAIConfig()"
        class="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Lưu cài đặt</button>
      <span x-show="aiSaveStatus==='saved'" class="text-xs text-green-600">✓ Đã lưu</span>
      <span x-show="aiSaveStatus==='error'" class="text-xs text-red-500">✗ Lỗi</span>
      <span x-show="aiSaveStatus==='saving'" class="text-xs text-gray-400">Đang lưu...</span>
    </div>
  </div>

  <!-- AI Conversations -->
  <div class="bg-white rounded-xl border border-gray-200 p-5">
    <p class="text-sm font-semibold text-gray-700 mb-3">Lịch sử hội thoại AI</p>
    <div class="flex gap-2 mb-4">
      <input x-model="aiConvContactId" type="text" placeholder="Contact ID hoặc Zalo User ID"
        class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      <button @click="loadAIConversations()"
        class="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 border border-gray-300">Tải</button>
      <button @click="deleteAIConversations()"
        class="text-xs bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 border border-red-200">Xoá</button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">Role</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">Nội dung</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">Thời gian</th>
          </tr>
        </thead>
        <tbody>
          <template x-for="msg in aiConversations" :key="msg.id">
            <tr class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-4 py-3">
                <span class="badge" :class="msg.role==='user'?'bg-blue-50 text-blue-700':'bg-green-50 text-green-700'"
                  x-text="msg.role==='user'?'Khách':'AI'"></span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-700 max-w-md">
                <span class="line-clamp-3" x-text="msg.content"></span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-400" x-text="(msg.created_at||'').slice(0,16).replace('T',' ')"></td>
            </tr>
          </template>
          <tr x-show="aiConversations.length===0">
            <td colspan="3" class="px-4 py-8 text-center text-sm text-gray-400">Nhập Contact ID và nhấn Tải để xem lịch sử.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- ════════════════════════════════════════════
     TAB: OA SETTINGS
════════════════════════════════════════════ -->
<div x-show="activeTab==='oa-settings'" x-transition>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">OA Settings</h2>
    <a href="/login"
      class="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">+ Kết nối OA mới</a>
  </div>

  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <table class="w-full text-sm">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">Tên OA</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">OA ID</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">App ID</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">Token Status</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">Cập nhật</th>
          <th class="px-4 py-3 text-xs font-semibold text-gray-500">Actions</th>
        </tr>
      </thead>
      <tbody>
        <template x-for="oa in oaList" :key="oa.id">
          <tr class="border-b border-gray-100 hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-gray-900 text-sm" x-text="oa.display_name || '—'"></td>
            <td class="px-4 py-3 text-xs font-mono text-gray-700" x-text="oa.oa_id || oa.id"></td>
            <td class="px-4 py-3 text-xs text-gray-500" x-text="oa.app_id"></td>
            <td class="px-4 py-3">
              <span class="badge" :class="oa.is_expiring_soon ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'"
                x-text="oa.is_expiring_soon ? '⚠ Sắp hết hạn' : '✓ Còn hạn'"></span>
            </td>
            <td class="px-4 py-3 text-xs text-gray-400" x-text="(oa.updated_at||'—').slice(0,16).replace('T',' ')"></td>
            <td class="px-4 py-3 text-right">
              <button @click="disconnectOA(oa)"
                class="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-2 py-1 rounded">
                Disconnect
              </button>
            </td>
          </tr>
        </template>
        <tr x-show="oaList.length===0&&!loading">
          <td colspan="6" class="px-4 py-10 text-center text-sm text-gray-400">
            Chưa có OA nào. <a href="/login" class="text-blue-600 hover:underline">Kết nối ngay →</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Loading / Error -->
<div x-show="loading" class="text-center text-sm text-gray-400 py-6 animate-pulse">Đang tải...</div>
<div x-show="globalError" x-cloak class="fixed bottom-4 right-4 bg-red-600 text-white text-sm rounded-xl px-4 py-3 shadow-lg"
  x-text="globalError"></div>

</main>

<script>
function app() {
  return {
    // ── State ──────────────────────────────────────
    loading: false,
    globalError: null,
    activeTab: 'dashboard',
    tabs: [
      {id:'dashboard', label:'Dashboard'},
      {id:'sequences', label:'Sequences'},
      {id:'contacts',  label:'Contacts'},
      {id:'logs',      label:'Message Logs'},
      {id:'analytics', label:'Analytics'},
      {id:'ai',        label:'AI'},
      {id:'oa-settings', label:'OA Settings'},
    ],

    // OA Management
    oaList: [],
    selectedOaId: '',

    // Status
    status: {},

    // Sequences
    sequences: [],
    showNewSeqForm: false,
    newSeq: {name:'', description:'', trigger_event:'manual', trigger_keyword:''},
    expandedSeqId: null,
    seqSteps: {},          // { [seqId]: step[] }
    addingStepFor: null,
    newStep: {delay_minutes:0, message_type:'text', message_content:'', template_id:''},
    previewResult: {},     // { [seqId]: rendered string }
    templateVars: ['{{display_name}}','{{phone}}','{{zalo_id}}','{{date}}','{{time}}','{{custom.___}}'],

    // Contacts
    contacts: [],
    contactsMeta: {},
    contactPage: 1,
    expandedContactId: null,
    contactMetadata: {},   // { [contactId]: metadata[] }
    newMeta: {},           // { [contactId+'.key']: string, [contactId+'.val']: string }
    testMsg: {},           // { [contactId]: string }
    testResult: {},        // { [contactId]: {ok, msg} }

    // Enrollments (for dashboard)
    enrollments: [],

    // Logs
    logs: [],
    logsMeta: {},
    logsPage: 1,
    logsStatus: '',

    // Analytics
    analytics: {},
    conversions: [],
    showConvModal: false,
    newConv: {contact_id: '', value_vnd: 0, notes: ''},

    // AI
    aiConfig: {},
    aiConversations: [],
    aiConvContactId: '',
    aiSaveStatus: '',

    // ── Init ───────────────────────────────────────
    async init() {
      this.loading = true;
      await Promise.all([
        this.loadOAs(),
        this.loadStatus(),
        this.loadSequences(),
        this.loadContacts(),
        this.loadEnrollments(),
        this.loadAnalytics(),
        this.loadConversions(),
      ]);
      this.loading = false;
    },

    switchTab(id) {
      this.activeTab = id;
      if (id==='logs' && this.logs.length===0) this.loadLogs();
      if (id==='ai' && !this.aiConfig.id) this.loadAIConfig();
      if (id==='analytics') { this.loadAnalytics(); this.loadConversions(); }
    },

    get selectedOaStatus() {
      if (!this.selectedOaId) return null;
      return this.oaList.find(o => o.id === this.selectedOaId) || null;
    },

    async onOaChange() {
      await Promise.all([
        this.loadSequences(),
        this.loadContacts(),
        this.loadEnrollments(),
        this.loadAnalytics(),
      ]);
      if (this.activeTab === 'logs') this.loadLogs();
    },

    // ── API Helpers ────────────────────────────────
    async api(path, opts={}) {
      const r = await fetch(path, {headers:{'Content-Type':'application/json'}, ...opts});
      const j = await r.json();
      if (!j.success && j.error) this.globalError = j.error;
      return j;
    },

    // ── Loaders ────────────────────────────────────
    async loadOAs() {
      const j=await this.api('/api/oas');
      if(j.success) this.oaList=j.data;
    },
    async loadStatus()    { const j=await this.api('/api/status');    if(j.success) this.status=j.data; },
    async loadSequences() {
      let url='/api/sequences';
      if(this.selectedOaId) url+='?oa_id='+this.selectedOaId;
      const j=await this.api(url);
      if(j.success) this.sequences=j.data;
    },
    async loadEnrollments() {
      let url='/api/enrollments?status=active';
      if(this.selectedOaId) url+='&oa_id='+this.selectedOaId;
      const j=await this.api(url);
      if(j.success) this.enrollments=j.data;
    },
    async loadContacts() {
      let url='/api/contacts?page='+this.contactPage+'&limit=50';
      if(this.selectedOaId) url+='&oa_id='+this.selectedOaId;
      const j=await this.api(url);
      if(j.success){ this.contacts=j.data; this.contactsMeta=j.meta||{}; }
    },
    async loadLogs() {
      let url='/api/message-logs?page='+this.logsPage+'&limit=50';
      if(this.logsStatus) url+='&status='+this.logsStatus;
      if(this.selectedOaId) url+='&oa_id='+this.selectedOaId;
      const j=await this.api(url);
      if(j.success){ this.logs=j.data; this.logsMeta=j.meta||{}; }
    },
    async loadAnalytics() {
      const j=await this.api('/api/analytics');
      if(j.success) this.analytics=j.data;
    },
    async loadConversions() {
      const j=await this.api('/api/conversions');
      if(j.success) this.conversions=j.data;
    },
    async logConversion() {
      if(!this.newConv.contact_id) return;
      const j=await this.api('/api/conversions',{method:'POST',body:JSON.stringify(this.newConv)});
      if(j.success){
        this.conversions.unshift(j.data);
        this.showConvModal=false;
        this.newConv={contact_id:'',value_vnd:0,notes:''};
        this.loadAnalytics();
      }
    },

    // ── Sequences ──────────────────────────────────
    async createSequence() {
      if(!this.newSeq.name) return;
      const j=await this.api('/api/sequences',{method:'POST',body:JSON.stringify(this.newSeq)});
      if(j.success){ this.sequences.unshift(j.data); this.showNewSeqForm=false; this.newSeq={name:'',description:'',trigger_event:'manual',trigger_keyword:''}; }
    },
    async toggleSequence(seq) {
      const j=await this.api('/api/sequences/'+seq.id+'/toggle',{method:'PATCH'});
      if(j.success) seq.is_active=j.data.is_active;
    },
    async toggleSeqExpand(id) {
      if(this.expandedSeqId===id){ this.expandedSeqId=null; return; }
      this.expandedSeqId=id;
      if(!this.seqSteps[id]){
        const j=await this.api('/api/sequences/'+id);
        if(j.success) this.seqSteps[id]=j.data.steps||[];
      }
    },
    async addStep(seqId) {
      if(!this.newStep.message_content) return;
      const j=await this.api('/api/sequences/'+seqId+'/steps',{method:'POST',body:JSON.stringify(this.newStep)});
      if(j.success){
        if(!this.seqSteps[seqId]) this.seqSteps[seqId]=[];
        this.seqSteps[seqId].push(j.data);
        this.addingStepFor=null;
      }
    },
    async previewStep(seqId) {
      if(!this.newStep.message_content) return;
      // Use first contact for preview if available
      const contactId=this.contacts[0]?.id||'';
      if(!contactId){ this.previewResult[seqId]='[Cần có contact để preview]'; return; }
      const j=await this.api('/api/messages/preview',{method:'POST',body:JSON.stringify({contact_id:contactId,template:this.newStep.message_content})});
      if(j.success) this.previewResult[seqId]=j.data.rendered;
    },

    // ── Contacts ───────────────────────────────────
    async toggleContactExpand(contact) {
      if(this.expandedContactId===contact.id){ this.expandedContactId=null; return; }
      this.expandedContactId=contact.id;
      if(!this.contactMetadata[contact.id]){
        const j=await this.api('/api/contacts/'+contact.id+'/metadata');
        if(j.success) this.contactMetadata[contact.id]=j.data;
      }
    },
    async addMeta(contactId) {
      const key=(this.newMeta[contactId+'.key']||'').trim();
      const val=this.newMeta[contactId+'.val']||'';
      if(!key) return;
      const j=await this.api('/api/contacts/'+contactId+'/metadata',{method:'POST',body:JSON.stringify({field_key:key,field_value:val})});
      if(j.success){
        if(!this.contactMetadata[contactId]) this.contactMetadata[contactId]=[];
        const idx=this.contactMetadata[contactId].findIndex(m=>m.field_key===key);
        if(idx>=0) this.contactMetadata[contactId][idx]=j.data;
        else this.contactMetadata[contactId].push(j.data);
        this.newMeta[contactId+'.key']=''; this.newMeta[contactId+'.val']='';
      }
    },
    async deleteMeta(contactId, key) {
      const j=await this.api('/api/contacts/'+contactId+'/metadata/'+key,{method:'DELETE'});
      if(j.success) this.contactMetadata[contactId]=this.contactMetadata[contactId].filter(m=>m.field_key!==key);
    },
    async testSend(contact) {
      const msg=this.testMsg[contact.id]||'';
      if(!msg) return;
      const j=await this.api('/api/messages/test-send',{method:'POST',body:JSON.stringify({contact_id:contact.id,message_content:msg})});
      this.testResult[contact.id]={ok:j.success,msg:j.success?'✓ Đã gửi: '+j.data.rendered_content:'✗ Lỗi: '+(j.error||'Thất bại')};
    },

    // ── OA Settings ────────────────────────────────
    async disconnectOA(oa) {
      if (!confirm('Ngắt kết nối OA "' + (oa.display_name||oa.id) + '"? Thao tác này không thể hoàn tác.')) return;
      const j=await this.api('/api/oas/'+oa.id,{method:'DELETE'});
      if(j.success){
        this.oaList=this.oaList.filter(o=>o.id!==oa.id);
        if(this.selectedOaId===oa.id){ this.selectedOaId=''; this.onOaChange(); }
      }
    },

    // ── AI ─────────────────────────────────────────
    async loadAIConfig() {
      const j=await this.api('/api/ai/config');
      if(j.success) this.aiConfig=j.data;
    },
    async saveAIConfig() {
      this.aiSaveStatus='saving';
      const payload={
        enabled: this.aiConfig.enabled,
        api_key: this.aiConfig.api_key==='***'?undefined:this.aiConfig.api_key,
        model: this.aiConfig.model,
        system_prompt: this.aiConfig.system_prompt,
        temperature: parseFloat(this.aiConfig.temperature),
        escalation_keywords: this.aiConfig.escalation_keywords,
      };
      const j=await this.api('/api/ai/config',{method:'PUT',body:JSON.stringify(payload)});
      this.aiSaveStatus=j.success?'saved':'error';
      setTimeout(()=>this.aiSaveStatus='',2000);
    },
    async loadAIConversations() {
      if(!this.aiConvContactId) return;
      const j=await this.api('/api/ai/conversations/'+this.aiConvContactId);
      if(j.success) this.aiConversations=j.data;
    },
    async deleteAIConversations() {
      if(!this.aiConvContactId) return;
      const j=await this.api('/api/ai/conversations/'+this.aiConvContactId,{method:'DELETE'});
      if(j.success) this.aiConversations=[];
    },

    // ── Utils ──────────────────────────────────────
    formatDelay(m) {
      if(m===0) return 'Ngay';
      if(m<60) return m+'ph';
      if(m<1440) return Math.round(m/60)+'h';
      return Math.round(m/1440)+'ngày';
    },
  };
}
</script>
</body>
</html>`;
