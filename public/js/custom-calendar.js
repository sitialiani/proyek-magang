// public/js/custom-calendar.js

// Initializing Variables
const calendarDates = document.querySelector('.calendar-dates');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

// Modal elements
const eventModal = document.getElementById('event-modal');
const modalDate = document.getElementById('modal-date');
const eventList = document.getElementById('event-list');
const closeModalBtn = document.getElementById('close-modal');


let currentDate = new Date(); // Tanggal saat ini (misal: 18 Juni 2025)
let currentMonth = currentDate.getMonth(); // Bulan saat ini (0-11)
let currentYear = currentDate.getFullYear(); // Tahun saat ini

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Global variable to hold events (akan diisi dari dashboard.ejs)
let globalCalendarEvents = [];

// Function to Render the Calendar
function renderCalendar(month, year) {
  calendarDates.innerHTML = ''; // Clear previous dates
  monthYear.textContent = `${months[month]} ${year}`;

  // Get the first day of the month (0 for Sunday, 1 for Monday, etc.)
  const firstDay = new Date(year, month, 1).getDay();

  // Get the number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get today's date for highlighting
  const today = new Date();

  // Create blanks for days of the week before the first day
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('div');
    blank.classList.add('p-2', 'text-center', 'border-b', 'border-gray-200');
    if (i % 7 === 6) { // Last column
        blank.classList.add('border-b', 'border-gray-200');
    } else {
        blank.classList.add('border-r', 'border-b', 'border-gray-200');
    }
    calendarDates.appendChild(blank);
  }

  // Populate the days
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.textContent = i;

    day.classList.add('p-2', 'text-center', 'cursor-pointer', 'hover:bg-gray-100', 'transition-colors', 'duration-100');

    if ((firstDay + i - 1) % 7 === 6) { // Last column
        day.classList.add('border-b', 'border-gray-200');
    } else {
        day.classList.add('border-r', 'border-b', 'border-gray-200');
    }

    // Highlight today's date using Tailwind classes
    if (
      i === today.getDate() &&
      year === today.getFullYear() &&
      month === today.getMonth() &&
      // Hanya highlight jika bulan/tahun kalender yang sedang ditampilkan adalah bulan/tahun sekarang
      month === currentDate.getMonth() && year === currentDate.getFullYear()
    ) {
      const span = document.createElement('span');
      span.textContent = i;
      span.classList.add('bg-blue-600', 'text-white', 'rounded-full', 'inline-flex', 'justify-center', 'items-center', 'w-8', 'h-8', 'mx-auto');
      day.innerHTML = '';
      day.appendChild(span);
      day.classList.remove('hover:bg-gray-100');
      day.classList.add('!bg-blue-600/90');
    }

    // --- BAGIAN BARU: Menampilkan event di kalender ---
    const currentDayFormatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const eventsOnThisDay = globalCalendarEvents.filter(event => event.date === currentDayFormatted);

    if (eventsOnThisDay.length > 0) {
        // Tambahkan indikator visual untuk event (misalnya titik kecil)
        const eventIndicator = document.createElement('div');
        eventIndicator.classList.add('w-1.5', 'h-1.5', 'bg-red-500', 'rounded-full', 'mx-auto', 'mt-1', 'group-hover:bg-red-700'); // Kecil, merah, bulat
        // Jika tanggal adalah hari ini, posisi relatif agar titik di bawah span
        if (day.querySelector('.current-date')) {
            day.classList.add('relative');
            eventIndicator.classList.add('absolute', 'bottom-1', 'left-1/2', '-translate-x-1/2');
        } else {
             day.classList.add('relative'); // Pastikan div punya posisi relative
             eventIndicator.classList.add('absolute', 'bottom-1', 'left-1/2', '-translate-x-1/2');
        }
       
        day.appendChild(eventIndicator);

        // Tambahkan atribut data untuk event agar mudah diakses saat diklik
        day.dataset.date = currentDayFormatted; // Simpan tanggal sebagai data atribut
        day.classList.add('has-events'); // Tambahkan kelas untuk event listener
    }
    // --- END BAGIAN BARU ---

    calendarDates.appendChild(day);
  }
}

// Event Listeners for Navigation Buttons
prevMonthBtn.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
});

// --- BAGIAN BARU: Logika Pop-up Event ---
function showEventModal(date) {
    modalDate.textContent = `Events on ${new Date(date).toLocaleDateString('id-ID')}`;
    eventList.innerHTML = ''; // Clear previous events

    const eventsForDate = globalCalendarEvents.filter(event => event.date === date);

    if (eventsForDate.length > 0) {
        eventsForDate.forEach(event => {
            const li = document.createElement('li');
            li.classList.add('text-gray-700', 'border-b', 'pb-2', 'last:border-b-0'); // Tailwind styling
            li.innerHTML = `
                <strong class="text-blue-700">${event.type.toUpperCase()}:</strong> 
                ${event.title} 
                <a href="${event.link}" class="text-blue-500 hover:underline text-sm ml-2">Lihat Detail</a>
            `;
            eventList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.classList.add('text-gray-500');
        li.textContent = 'No events for this date.';
        eventList.appendChild(li);
    }

    eventModal.classList.remove('hidden'); // Show modal
}

function closeEventModal() {
    eventModal.classList.add('hidden'); // Hide modal
}
// --- END BAGIAN BARU ---

// Initial Render and Event Listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Ambil data event dari variabel global yang di-set di EJS
    // Pastikan CALENDAR_EVENTS sudah didefinisikan secara global oleh EJS
    if (typeof CALENDAR_EVENTS !== 'undefined' && Array.isArray(CALENDAR_EVENTS)) {
        globalCalendarEvents = CALENDAR_EVENTS;
    } else {
        console.warn("CALENDAR_EVENTS tidak ditemukan atau bukan array. Event kalender mungkin tidak tampil.");
        globalCalendarEvents = [];
    }

    renderCalendar(currentMonth, currentYear);

    // Event listener untuk klik pada tanggal
    calendarDates.addEventListener('click', (e) => {
        const clickedDayElement = e.target.closest('.calendar-dates > div');
        
        if (clickedDayElement) {
            // Cek apakah tanggal ini memiliki event
            if (clickedDayElement.classList.contains('has-events')) {
                const date = clickedDayElement.dataset.date;
                if (date) {
                    showEventModal(date);
                }
            } else if (clickedDayElement.textContent.trim() !== '') {
                 // Untuk tanggal tanpa event, tetap munculkan alert sederhana (opsional)
                 // const clickedDay = clickedDayElement.textContent.trim();
                 // alert(`You clicked on ${clickedDay} ${months[currentMonth]} ${currentYear}`);
            }
        }
    });

    // Event listener untuk tombol tutup modal
    closeModalBtn.addEventListener('click', closeEventModal);
    // Tutup modal jika di-klik di luar area modal (optional)
    eventModal.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            closeEventModal();
        }
    });
});