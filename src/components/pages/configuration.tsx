import * as React from 'react';
import { BackupManager } from '../../framework/persistence/backup';
import { PrimaryButton, DangerButton } from '../buttons';
import { useMetadata } from '../../services/applicationMetadata';
import { LocalStorage } from '../../framework/persistence/storage';
import { CheckBox } from '../controls';
import { Section, SubSection } from '../layout';

interface RestoreResult {
    success: boolean;
    filename: string;
    error?: Error;
}

const backupManger = new BackupManager(new LocalStorage());

export function Configuration() {
    const metaDataLens = useMetadata();
    const { lastBackup, lastRestore } = metaDataLens.state;
    const offlineLens = metaDataLens.zoom('offlineMode');
    const [restoreResult, setRestoreResult] = React.useState<RestoreResult | null>(null);
    const fileInput = React.useRef<HTMLInputElement>(null);

    async function restore(file: File) {
        setRestoreResult(null);
        const content = await backupManger.readFile(file);
        try {
            backupManger.restoreLocalStorage(content);
            metaDataLens.setState(m => ({ ...m, lastRestore: new Date() }));
        } catch (e) {
            setRestoreResult({
                success: false,
                filename: file.name,
                error: e,
            });
        }
        setRestoreResult({
            success: true,
            filename: file.name,
        });
    }

    function pickFile() {
        if (fileInput.current) {
            fileInput.current.click();
        }
    }

    function backup() {
        backupManger.download('ironsworn_backup.json', backupManger.backupLocalStorage());
        metaDataLens.setState(m => ({ ...m, lastBackup: new Date() }));
    }

    return (
        <>
            <Section className="my-2 max-w-lg" title="Configuration">
                <div className="w-32 my-2">
                    <CheckBox title="offline mode" lens={offlineLens} />
                </div>
                <SubSection className="my-2" title="Backup & restore">
                    <p className="my-2 p-2 rounded-sm color-danger">
                        Warning: clicking on the restore button will delete all the existing data on this device
                    </p>
                    <input
                        ref={fileInput}
                        className="hidden"
                        accept=".json"
                        type="file"
                        onChange={e => {
                            const { files } = e.target;
                            if (files) {
                                restore(files[0]);
                            }
                        }}
                    />
                    <PrimaryButton onClick={backup}>Backup</PrimaryButton>
                    <DangerButton className="mx-2" onClick={pickFile}>
                        Restore
                    </DangerButton>
                    {restoreResult && <RestoreResult result={restoreResult} />}
                    {lastBackup && <p>Last backup: {lastBackup.toLocaleString('en')}</p>}
                    {lastRestore && <p>Last restore: {lastRestore.toLocaleString('en')}</p>}
                </SubSection>
            </Section>
        </>
    );
}

function RestoreResult({ result }: { result: RestoreResult }) {
    return (
        <>
            {result.success ? (
                <p>Successfully restored data from &quot;{result.filename}&quot;</p>
            ) : (
                <p>Error while restoring data</p>
            )}
            {result.error && <p>{result.error.toString()}</p>}
        </>
    );
}
