import {
  AlertTriangle,
  ArrowRight,
  ArrowDownToLine,
  Check,
  ChevronLeft,
  ChevronRight,
  Star,
  Command,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  Settings2,
  SunMedium,
  Save,
  Trash,
  Twitter,
  Linkedin,
  User,
  X,
} from "lucide-react";
import type { LucideProps, LucideIcon } from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  star: Star,
  logo: Command,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  document: FileText,
  page: File,
  media: Image,
  settings: Settings,
  settings2: Settings2,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  save: Save,
  moon: Moon,
  laptop: Laptop,
  arrowDownToLine: ArrowDownToLine,
  twitter: Twitter,
  linkedin: Linkedin,
  check: Check,
  brand: ({ ...props }: LucideProps) => (
    <svg
      {...props}
      width="400"
      height="400"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="path-1-outside-1_18_7"
        maskUnits="userSpaceOnUse"
        x="66.6274"
        y="45.8954"
        width="267"
        height="309"
        fill="black"
      >
        <rect fill="white" x="66.6274" y="45.8954" width="267" height="309" />
        <path d="M133.987 86.2745L68.6274 124.052V200V276.078L134.248 313.987L200 351.895L265.621 313.987L331.373 276.078V200V123.922L266.013 86.1438C230.065 65.3595 200.392 48.366 200 48.366C199.608 48.366 169.935 65.4902 133.987 86.2745ZM238.824 73.9869C259.477 86.0131 280.523 98.1699 285.49 100.915L294.379 106.144L280.261 114.51C272.418 119.085 265.621 122.876 265.229 122.876C264.837 122.876 250.196 114.641 232.68 104.575C215.294 94.3791 200.261 86.2745 199.346 86.536C195.948 87.451 166.013 105.359 166.405 106.275C166.536 106.928 180.654 115.425 197.778 125.229C214.771 135.163 228.627 143.399 228.627 143.791C228.627 144.183 222.222 148.105 214.379 152.549L200.131 160.654L171.634 144.314C155.948 135.294 141.307 126.797 139.216 125.49L135.163 123.007L118.954 132.418L102.614 141.961L87.8431 133.464C73.5948 125.359 73.0719 124.967 76.0784 123.399C77.647 122.484 105.882 106.144 138.562 87.0588C171.242 68.1046 198.693 52.4183 199.608 52.4183C200.392 52.2876 218.039 62.0915 238.824 73.9869ZM232.941 108.105L265.098 126.797L280.784 117.647C289.412 112.549 296.993 108.497 297.386 108.497C299.608 108.497 326.667 124.837 325.752 125.49C325.229 126.013 298.954 141.307 267.32 159.346C235.686 177.516 207.712 193.726 205.098 195.425L200.392 198.431L154.248 171.765C128.889 157.124 107.451 144.967 106.667 144.706C104.706 143.922 104.706 143.922 120.784 134.771L135.033 126.797L166.797 145.098C184.314 155.163 199.216 163.399 200.131 163.399C202.222 163.399 233.987 144.967 233.987 143.791C233.987 143.137 219.869 134.641 202.614 124.706C185.359 114.771 171.765 106.144 172.418 105.49C174.118 103.791 199.216 89.1503 200.131 89.4118C200.523 89.4118 215.294 97.9085 232.941 108.105ZM83.268 134.248C89.0196 137.778 117.386 153.987 146.144 170.588L198.562 200.654L198.693 255.294C198.693 285.359 198.301 309.673 197.778 309.412C197.124 309.15 190.458 305.229 182.745 300.784L168.627 292.549V255.033V217.647L152.288 208.105C143.268 203.007 135.425 198.693 134.641 198.693C133.856 198.693 133.333 211.765 133.333 235.425C133.333 255.556 132.81 271.895 132.288 271.634C131.765 271.373 125.229 267.712 117.908 263.529L104.575 255.686V218.17V180.523L88.2353 171.242L71.8954 161.961V144.967C71.8954 135.686 72.1569 128.105 72.2876 128.105C72.549 128.105 77.5163 130.85 83.268 134.248ZM328.105 201.438L327.451 274.771L311.111 284.183C264.052 311.503 235.163 328.105 234.641 328.105C234.248 328.105 233.987 320.654 233.987 311.373V294.771L266.667 275.817L299.346 256.993V236.863C299.346 219.085 299.085 216.863 297.255 217.516C295.817 218.039 255.817 240.915 234.902 253.203C234.379 253.464 234.118 246.013 234.248 236.601L234.641 219.346L266.667 200.784L298.693 182.353L299.085 163.268L299.477 144.314L313.464 136.209C321.176 131.765 327.712 128.105 328.105 128.105C328.497 128.105 328.497 161.046 328.105 201.438ZM295.817 163.529L295.425 180.784L263.399 199.216L231.373 217.516V237.516C231.373 248.497 231.895 257.516 232.549 257.516C233.203 257.516 247.32 249.543 264.052 239.869C280.784 230.196 294.902 222.222 295.294 222.222C295.686 222.222 295.948 229.673 295.817 238.824L295.556 255.556L263.791 273.987L232.026 292.418L231.373 311.634L230.719 330.719L216.34 338.954L201.961 347.32L201.569 273.987C201.438 233.726 201.699 200.523 202.222 200.261C202.876 200.131 223.922 187.974 249.02 173.333C274.248 158.693 295.033 146.667 295.425 146.536C295.817 146.405 295.948 154.118 295.817 163.529ZM86.9281 173.987L100.654 181.961V219.477V256.993L117.908 266.928C127.451 272.418 135.686 276.732 136.209 276.34C136.732 275.948 136.993 259.216 136.863 239.216C136.732 219.085 136.732 202.614 136.993 202.614C137.124 202.614 139.477 204.052 142.222 205.752C144.837 207.451 151.373 211.242 156.601 214.248L166.013 219.739V257.255V294.771L182.353 303.922L198.562 313.072L198.693 330.458V347.974L194.379 345.359C192.157 343.791 163.66 327.32 131.373 308.627L72.549 274.641L72.1569 220.392C72.0261 190.458 72.1569 166.013 72.549 166.013C72.9412 166.013 79.4771 169.542 86.9281 173.987Z" />
      </mask>
      <path
        d="M133.987 86.2745L68.6274 124.052V200V276.078L134.248 313.987L200 351.895L265.621 313.987L331.373 276.078V200V123.922L266.013 86.1438C230.065 65.3595 200.392 48.366 200 48.366C199.608 48.366 169.935 65.4902 133.987 86.2745ZM238.824 73.9869C259.477 86.0131 280.523 98.1699 285.49 100.915L294.379 106.144L280.261 114.51C272.418 119.085 265.621 122.876 265.229 122.876C264.837 122.876 250.196 114.641 232.68 104.575C215.294 94.3791 200.261 86.2745 199.346 86.536C195.948 87.451 166.013 105.359 166.405 106.275C166.536 106.928 180.654 115.425 197.778 125.229C214.771 135.163 228.627 143.399 228.627 143.791C228.627 144.183 222.222 148.105 214.379 152.549L200.131 160.654L171.634 144.314C155.948 135.294 141.307 126.797 139.216 125.49L135.163 123.007L118.954 132.418L102.614 141.961L87.8431 133.464C73.5948 125.359 73.0719 124.967 76.0784 123.399C77.647 122.484 105.882 106.144 138.562 87.0588C171.242 68.1046 198.693 52.4183 199.608 52.4183C200.392 52.2876 218.039 62.0915 238.824 73.9869ZM232.941 108.105L265.098 126.797L280.784 117.647C289.412 112.549 296.993 108.497 297.386 108.497C299.608 108.497 326.667 124.837 325.752 125.49C325.229 126.013 298.954 141.307 267.32 159.346C235.686 177.516 207.712 193.726 205.098 195.425L200.392 198.431L154.248 171.765C128.889 157.124 107.451 144.967 106.667 144.706C104.706 143.922 104.706 143.922 120.784 134.771L135.033 126.797L166.797 145.098C184.314 155.163 199.216 163.399 200.131 163.399C202.222 163.399 233.987 144.967 233.987 143.791C233.987 143.137 219.869 134.641 202.614 124.706C185.359 114.771 171.765 106.144 172.418 105.49C174.118 103.791 199.216 89.1503 200.131 89.4118C200.523 89.4118 215.294 97.9085 232.941 108.105ZM83.268 134.248C89.0196 137.778 117.386 153.987 146.144 170.588L198.562 200.654L198.693 255.294C198.693 285.359 198.301 309.673 197.778 309.412C197.124 309.15 190.458 305.229 182.745 300.784L168.627 292.549V255.033V217.647L152.288 208.105C143.268 203.007 135.425 198.693 134.641 198.693C133.856 198.693 133.333 211.765 133.333 235.425C133.333 255.556 132.81 271.895 132.288 271.634C131.765 271.373 125.229 267.712 117.908 263.529L104.575 255.686V218.17V180.523L88.2353 171.242L71.8954 161.961V144.967C71.8954 135.686 72.1569 128.105 72.2876 128.105C72.549 128.105 77.5163 130.85 83.268 134.248ZM328.105 201.438L327.451 274.771L311.111 284.183C264.052 311.503 235.163 328.105 234.641 328.105C234.248 328.105 233.987 320.654 233.987 311.373V294.771L266.667 275.817L299.346 256.993V236.863C299.346 219.085 299.085 216.863 297.255 217.516C295.817 218.039 255.817 240.915 234.902 253.203C234.379 253.464 234.118 246.013 234.248 236.601L234.641 219.346L266.667 200.784L298.693 182.353L299.085 163.268L299.477 144.314L313.464 136.209C321.176 131.765 327.712 128.105 328.105 128.105C328.497 128.105 328.497 161.046 328.105 201.438ZM295.817 163.529L295.425 180.784L263.399 199.216L231.373 217.516V237.516C231.373 248.497 231.895 257.516 232.549 257.516C233.203 257.516 247.32 249.543 264.052 239.869C280.784 230.196 294.902 222.222 295.294 222.222C295.686 222.222 295.948 229.673 295.817 238.824L295.556 255.556L263.791 273.987L232.026 292.418L231.373 311.634L230.719 330.719L216.34 338.954L201.961 347.32L201.569 273.987C201.438 233.726 201.699 200.523 202.222 200.261C202.876 200.131 223.922 187.974 249.02 173.333C274.248 158.693 295.033 146.667 295.425 146.536C295.817 146.405 295.948 154.118 295.817 163.529ZM86.9281 173.987L100.654 181.961V219.477V256.993L117.908 266.928C127.451 272.418 135.686 276.732 136.209 276.34C136.732 275.948 136.993 259.216 136.863 239.216C136.732 219.085 136.732 202.614 136.993 202.614C137.124 202.614 139.477 204.052 142.222 205.752C144.837 207.451 151.373 211.242 156.601 214.248L166.013 219.739V257.255V294.771L182.353 303.922L198.562 313.072L198.693 330.458V347.974L194.379 345.359C192.157 343.791 163.66 327.32 131.373 308.627L72.549 274.641L72.1569 220.392C72.0261 190.458 72.1569 166.013 72.549 166.013C72.9412 166.013 79.4771 169.542 86.9281 173.987Z"
        fill="white"
      />
      <path
        d="M133.987 86.2745L68.6274 124.052V200V276.078L134.248 313.987L200 351.895L265.621 313.987L331.373 276.078V200V123.922L266.013 86.1438C230.065 65.3595 200.392 48.366 200 48.366C199.608 48.366 169.935 65.4902 133.987 86.2745ZM238.824 73.9869C259.477 86.0131 280.523 98.1699 285.49 100.915L294.379 106.144L280.261 114.51C272.418 119.085 265.621 122.876 265.229 122.876C264.837 122.876 250.196 114.641 232.68 104.575C215.294 94.3791 200.261 86.2745 199.346 86.536C195.948 87.451 166.013 105.359 166.405 106.275C166.536 106.928 180.654 115.425 197.778 125.229C214.771 135.163 228.627 143.399 228.627 143.791C228.627 144.183 222.222 148.105 214.379 152.549L200.131 160.654L171.634 144.314C155.948 135.294 141.307 126.797 139.216 125.49L135.163 123.007L118.954 132.418L102.614 141.961L87.8431 133.464C73.5948 125.359 73.0719 124.967 76.0784 123.399C77.647 122.484 105.882 106.144 138.562 87.0588C171.242 68.1046 198.693 52.4183 199.608 52.4183C200.392 52.2876 218.039 62.0915 238.824 73.9869ZM232.941 108.105L265.098 126.797L280.784 117.647C289.412 112.549 296.993 108.497 297.386 108.497C299.608 108.497 326.667 124.837 325.752 125.49C325.229 126.013 298.954 141.307 267.32 159.346C235.686 177.516 207.712 193.726 205.098 195.425L200.392 198.431L154.248 171.765C128.889 157.124 107.451 144.967 106.667 144.706C104.706 143.922 104.706 143.922 120.784 134.771L135.033 126.797L166.797 145.098C184.314 155.163 199.216 163.399 200.131 163.399C202.222 163.399 233.987 144.967 233.987 143.791C233.987 143.137 219.869 134.641 202.614 124.706C185.359 114.771 171.765 106.144 172.418 105.49C174.118 103.791 199.216 89.1503 200.131 89.4118C200.523 89.4118 215.294 97.9085 232.941 108.105ZM83.268 134.248C89.0196 137.778 117.386 153.987 146.144 170.588L198.562 200.654L198.693 255.294C198.693 285.359 198.301 309.673 197.778 309.412C197.124 309.15 190.458 305.229 182.745 300.784L168.627 292.549V255.033V217.647L152.288 208.105C143.268 203.007 135.425 198.693 134.641 198.693C133.856 198.693 133.333 211.765 133.333 235.425C133.333 255.556 132.81 271.895 132.288 271.634C131.765 271.373 125.229 267.712 117.908 263.529L104.575 255.686V218.17V180.523L88.2353 171.242L71.8954 161.961V144.967C71.8954 135.686 72.1569 128.105 72.2876 128.105C72.549 128.105 77.5163 130.85 83.268 134.248ZM328.105 201.438L327.451 274.771L311.111 284.183C264.052 311.503 235.163 328.105 234.641 328.105C234.248 328.105 233.987 320.654 233.987 311.373V294.771L266.667 275.817L299.346 256.993V236.863C299.346 219.085 299.085 216.863 297.255 217.516C295.817 218.039 255.817 240.915 234.902 253.203C234.379 253.464 234.118 246.013 234.248 236.601L234.641 219.346L266.667 200.784L298.693 182.353L299.085 163.268L299.477 144.314L313.464 136.209C321.176 131.765 327.712 128.105 328.105 128.105C328.497 128.105 328.497 161.046 328.105 201.438ZM295.817 163.529L295.425 180.784L263.399 199.216L231.373 217.516V237.516C231.373 248.497 231.895 257.516 232.549 257.516C233.203 257.516 247.32 249.543 264.052 239.869C280.784 230.196 294.902 222.222 295.294 222.222C295.686 222.222 295.948 229.673 295.817 238.824L295.556 255.556L263.791 273.987L232.026 292.418L231.373 311.634L230.719 330.719L216.34 338.954L201.961 347.32L201.569 273.987C201.438 233.726 201.699 200.523 202.222 200.261C202.876 200.131 223.922 187.974 249.02 173.333C274.248 158.693 295.033 146.667 295.425 146.536C295.817 146.405 295.948 154.118 295.817 163.529ZM86.9281 173.987L100.654 181.961V219.477V256.993L117.908 266.928C127.451 272.418 135.686 276.732 136.209 276.34C136.732 275.948 136.993 259.216 136.863 239.216C136.732 219.085 136.732 202.614 136.993 202.614C137.124 202.614 139.477 204.052 142.222 205.752C144.837 207.451 151.373 211.242 156.601 214.248L166.013 219.739V257.255V294.771L182.353 303.922L198.562 313.072L198.693 330.458V347.974L194.379 345.359C192.157 343.791 163.66 327.32 131.373 308.627L72.549 274.641L72.1569 220.392C72.0261 190.458 72.1569 166.013 72.549 166.013C72.9412 166.013 79.4771 169.542 86.9281 173.987Z"
        stroke="white"
        strokeWidth="4"
        mask="url(#path-1-outside-1_18_7)"
      />
      <path
        d="M74 273V169.5L98.5 183V258L138 279L139 206.5L164 221V296L196.5 314V344L74 273Z"
        fill="black"
      />
      <path
        d="M74 131.5V161L107 180V254L131 268L132.5 195.5L171 216.5V291.5L196.5 306V202L74 131.5Z"
        fill="black"
      />
      <path
        d="M199.5 54.5L78 125L102.5 139.5L135 120.5L199.5 158.5L224.5 144L163 106L199.5 84L265.5 120.5L290 106L199.5 54.5Z"
        fill="black"
      />
      <path
        d="M135 129.5L110.5 144L199.5 195.5L322 125L297.5 110.5L265.5 129.5L199.5 92L176.5 106L238.5 144L199.5 166.5L135 129.5Z"
        fill="black"
      />
      <path
        d="M204.5 344V202L293.5 150.5V180L229 216.5V261L293.5 225.5V254L229 291.5V329.5L204.5 344Z"
        fill="black"
      />
      <path
        d="M326 131.5L302 145.5V183L236.5 220.5V249.5L300 214L302 258L236.5 296V324.5L326 274V131.5Z"
        fill="black"
      />
      <path
        d="M74 273V169.5L98.5 183V258L138 279L139 206.5L164 221V296L196.5 314V344L74 273Z"
        stroke="black"
      />
      <path
        d="M74 131.5V161L107 180V254L131 268L132.5 195.5L171 216.5V291.5L196.5 306V202L74 131.5Z"
        stroke="black"
      />
      <path
        d="M199.5 54.5L78 125L102.5 139.5L135 120.5L199.5 158.5L224.5 144L163 106L199.5 84L265.5 120.5L290 106L199.5 54.5Z"
        stroke="black"
      />
      <path
        d="M135 129.5L110.5 144L199.5 195.5L322 125L297.5 110.5L265.5 129.5L199.5 92L176.5 106L238.5 144L199.5 166.5L135 129.5Z"
        stroke="black"
      />
      <path
        d="M204.5 344V202L293.5 150.5V180L229 216.5V261L293.5 225.5V254L229 291.5V329.5L204.5 344Z"
        stroke="black"
      />
      <path
        d="M326 131.5L302 145.5V183L236.5 220.5V249.5L300 214L302 258L236.5 296V324.5L326 274V131.5Z"
        stroke="black"
      />
    </svg>
  ),
  google: ({ ...props }: LucideProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  ),
};