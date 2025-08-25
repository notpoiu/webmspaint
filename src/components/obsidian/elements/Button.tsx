function ButtonBase({ text }: { text: string }) {
    return (
        <div className="w-full h-[26px] justify-center rounded-[1px] bg-[rgb(25,25,25)] hover:bg-[rgb(35,35,35)] border-[rgb(40,40,40)] border">
            <span className={`text-center text-white text-sm opacity-50 truncate`}>{text}</span>
        </div>
    );
}

export default function Button({ text, subButton }: { text: string, subButton?: { text: string } }) {
    if (subButton != undefined) {
        return (    
            <div className="flex flex-row gap-2">
                <ButtonBase text={text} />
                <ButtonBase text={subButton.text} />
            </div>
        );
    }

    return <ButtonBase text={text} />
}