export default function Label({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-left block text-white text-sm opacity-80">{children}</span>
    );
}